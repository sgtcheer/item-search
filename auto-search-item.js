function getShopIndex(responseText, shopNameSearched) {
	var shopIndex = -1;
	var totalShopCount = 48;
	var nickStartOffset = 7;
	var nickStopOffset = -4;
	var nextShopOffset = 13;
	for(var i = 0; i < totalShopCount; i++) {
		var nickStartIndex = responseText.indexOf('nick')+nickStartOffset;
		var nickStopIndex = responseText.indexOf('shopcard')+nickStopOffset;
		var nick = responseText.substring(nickStartIndex,nickStopIndex+1);
		if(nick == shopNameSearched)
			break;
		responseText = responseText.substring(nickStopIndex+nextShopOffset);
	}
	if(i == totalShopCount) {
		shopIndex = -1;
	}
	else {
		shopIndex = i+1;
	}
	return shopIndex;
}
function getShopLocation(shopIndex) {
	var column = shopIndex % 4;
	if(column == 0) {
		column = 4;
		var row = shopIndex / 4;
	}
	else {
		var row = (shopIndex - column) / 4 + 1;
	}
	var shopLocation = 'row=' + row + '\n' + 'column=' + column;
	return shopLocation;
}
function getNextPageUrl() {
	var url = window.location;
	var queryUrl = url.search;
	var baseUrl = queryUrl.split('s=')[0];
	var sValue = parseInt( queryUrl.split('s=')[1].split('&')[0] );
	var dataValue = sValue + 44;
	var nextPageUrl= 'search' + baseUrl + 's=' + sValue + '&data-key=s&data-value=' + dataValue;
	return nextPageUrl;
}
var shopNameSearched = window.prompt('Please input the shop name!');
var className = 'shopname J_MouseEneterLeave J_ShopInfo';
var shopName = document.getElementsByClassName(className);
var shopCount = shopName.length;
var shopNameOffset = 3;
var page = 1;
for(var i = 0; i < shopCount; i++) {
	var shop = shopName[i];
	if(shop.childNodes[shopNameOffset].textContent == shopNameSearched)
		break;
}
if(i == shopCount)
	var msg = 'can not find the specified shop';
else {
	var shopIndex = i + 1;
	var msg = 'page=' + page + '\n' + getShopLocation(shopIndex);
}
if(msg == 'can not find the specified shop') {
	var totalPage=4;
	var isStop =false;
	for(var pageIndex = 2; !isStop && pageIndex <= totalPage; pageIndex++) {
		var nextPageUrl= getNextPageUrl();
		var request = new XMLHttpRequest();
		request.open('GET', nextPageUrl,false);
		request.send(null);
		var responseText = request.responseText;
		var shopIndex = getShopIndex(responseText, shopNameSearched);
		if(shopIndex > -1) {
			var shopLocation = getShopLocation(shopIndex);
			msg = 'page=' + pageIndex + '\n' + shopLocation;
			isStop= true;
			alert(msg);
		}
	}
}
else {
	alert(msg);
}