/**
 *   param    responseText 		   the html in text format
 *   param    shopNameSearched 	   the name of the shop you want to find
 *   return   If the specified shop is found, then return the index of 
 *			  the shop which is range from 1 to 48. Otherwise, -1 is 
 *			  returned.
 *
 */
function searchShopByText(responseText, shopNameSearched) {
	var shopIndex = -1;
	var totalShopCount = 48;
	/** The next three parameters depend on the words of "nick" and "shopcard".
	 *  If you want to know why they are 7, -4, 13 respectively, just read the
	 *  html text.
	 */
	var nickStartOffset = 7;
	var nickStopOffset = -4;
	var nextShopOffset = 13;
	for(var i = 0; i < totalShopCount; i++) {
		var nickStartIndex = responseText.indexOf('nick')+nickStartOffset;
		var nickStopIndex = responseText.indexOf('shopcard')+nickStopOffset;
		var nick = responseText.substring(nickStartIndex,nickStopIndex+1);
		if(nick.search(shopNameSearched) !== -1)
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
/**
 *  Search the shop using the Location object.
 *  param    shopNameSearched    the name of the shop you want to find
 *  return   If the specified shop is found, then return the index of 
 *			 the shop which is range from 1 to 48. Otherwise, -1 is 
 *			 returned. 
 */
function searchShopByHTML(shopNameSearched) {
	var className = 'shopname J_MouseEneterLeave J_ShopInfo';
	var shopName = document.getElementsByClassName(className);
	var shopCount = shopName.length;
	// the following parameter depends on the structure of the html of taobao
	var shopNameOffset = 3;
	for(var i = 0; i < shopCount; i++) {
		var shop = shopName[i];		
		if(shop.childNodes[shopNameOffset].textContent.search(shopNameSearched) !== -1)
			break;
	}
	if(i == shopCount)
		var shopIndex = -1;
	else {
		var shopIndex = i + 1;		
	}
	return shopIndex;
}
/**
 *   param    shopIndex    the index of the shop which is range 
 *	 					   from 1 to 48
 *	 return   return the row of the specified index of the shop
 *			  as well as the column. You can find the shop in
 *			  your explorer by the row and column. For example,
 *			  one page has 11 rows and 4 columns for 360 browser.
 */
function getShopLocation(shopIndex) {
	var column = shopIndex % 4;
	if(column == 0) {
		column = 4;
		var row = shopIndex / 4;
	}
	else {
		var row = (shopIndex - column) / 4 + 1;
	}
	var shopLocation = '第' + row + '行' + '\n' + '第' + column + '列';
	return shopLocation;
}

/**
 *	param	sValue	sValue is a key parameter of the URL which has
 *	 		relation with the page number of the current html page.
 *	return	the page number of the current html page is returned.
 */
function getCurrentPageNumber(sValue) {
	var pageNumber = sValue / 44 + 1;
	return pageNumber;
}
/**
 *	param	str is the string you want to match with. Note that the
 *			string may contain sign of '*' ,which denotes arbitrary
 *			sign with arbitrary length.  		
 *	return	the regular expression of the string is returned.
 */
function getRegularExpression(str) {
	var firstIndex = str.indexOf('*');
	var lastIndex = str.lastIndexOf('*');
	if(firstIndex !== -1)		
		str = str.substring(0 , firstIndex) + '.*' + str.substring(lastIndex + 1);	
	var regEx = new RegExp('^' + str + '$');
	return regEx;	
}

// The main program
var shopNameSearched = window.prompt('请输入要搜索的店铺的掌柜名');
var shopNameSearched = getRegularExpression(shopNameSearched);
var isStop =false;
var totalPage = 20;// the maximum number of page that can be searched	
var queryUrl = window.location.search;	
var sIndex = queryUrl.lastIndexOf('s=');
var baseUrl = queryUrl.substring(0 , sIndex);
var url = queryUrl.substring(sIndex +2);
var sValueIndex = url.indexOf('&');	
if(sValueIndex === -1 ) {
	var sValue = parseInt(url);
	var isOffset = false;
}
else {
	var sValue = parseInt( url.substring(0 , sValueIndex ) );
	var offsetUrl = url.substring(sValueIndex);
	var isOffset = true;
}
var pageIndex = getCurrentPageNumber(sValue);
var shopIndex=searchShopByHTML(shopNameSearched);
if( shopIndex === -1) {
	var msg = 'can not find the specified shop';	
}
else {
	var shopLocation = getShopLocation(shopIndex);
	var msg = '第' + pageIndex + '页' + '\n' + getShopLocation(shopIndex);
}
if(msg === 'can not find the specified shop') {	
	for(pageIndex += 1; !isStop && pageIndex <= totalPage; pageIndex++) {
		sValue += 44;
		if( isOffset === true )	{	
			var nextPageUrl= 'search' + baseUrl + 's=' + sValue + offsetUrl;
		}
		else {
			var nextPageUrl= 'search' + baseUrl + 's=' + sValue;
		}
		var request = new XMLHttpRequest();
		request.open('GET', nextPageUrl, false);
		request.send(null);
		var responseText = request.responseText;
		var shopIndex = searchShopByText(responseText, shopNameSearched);
		if(shopIndex > -1) {			
			isStop= true;
			/** You can replace the statement before with a "break". 
			 *  If you do this, you should put the following two
			 *  statements outside the for loop.
			 */			
			msg = '第' + getCurrentPageNumber(sValue) + '页' + '\n' + getShopLocation(shopIndex);					
		}
	}
}	
if(msg === 'can not find the specified shop') {	
	msg = '不存在与该掌柜名对应的店铺';
}
alert(msg);
if(isStop === true) {
	window.location = nextPageUrl;
}
