// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "hardhat/console.sol";


contract MarketPlace is ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    address payable owner;
    uint256 listingPrice = 0.001 ether;

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => MarketItem) private idMarketItem;

    event idMarketItemCreated (
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    modifier onlyOwner{
        require(msg.sender==owner);
        _;
    }

    constructor() ERC721("Meme Museum TOKEN","MMT"){
        owner  = payable(msg.sender);
    }

    function updateListingPrice(uint256 _price) public payable onlyOwner{
        listingPrice = _price;   
    }
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    // Creating Market Items functions
    function createToken(string memory tokenURI, uint256 price) public payable returns(uint256){
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        createMarketItem(newTokenId,price);

        return newTokenId;
    }

    function createMarketItem (uint _tokenId, uint256 _price) private {
        require(_price>0,"Price must be greater than 0!");
        require(msg.value==listingPrice, "Price must be equal to listing price");

        idMarketItem[_tokenId] = MarketItem(
            _tokenId,
            payable(msg.sender),
            payable(address(this)),
            _price,
            false
        );

        _transfer(msg.sender, address(this), _tokenId);

        emit idMarketItemCreated(_tokenId, msg.sender, address(this), _price, false);


    }

    // Resale function

    function reSellToken(uint256 _tokenId, uint256 _price) public payable {
        require(idMarketItem[_tokenId].owner == msg.sender, 'You have to be the owner of the NFTs to sell it!');
        require(msg.value == listingPrice,"Price must be equal to listing price!");

        idMarketItem[_tokenId].seller = payable(msg.sender);
        idMarketItem[_tokenId].owner = payable(address(this));
        idMarketItem[_tokenId].price = _price;
        idMarketItem[_tokenId].sold = false;

        _itemsSold.decrement();

        _transfer(msg.sender, address(this), _tokenId);
    }

    //Market sale creation function

    function createMarketSale(uint256 tokenId) public payable{
        uint256 price = idMarketItem[tokenId].price;
        require(msg.value==price,"Please provide the exact price!");

        idMarketItem[tokenId].owner = payable(msg.sender);
        idMarketItem[tokenId].sold = true;
        idMarketItem[tokenId].owner = payable(address(0));

        _itemsSold.increment();

        _transfer(address(this), msg.sender, tokenId);

        payable(owner).transfer(listingPrice);
        payable(idMarketItem[tokenId].seller).transfer(msg.value);
    }

    
}



