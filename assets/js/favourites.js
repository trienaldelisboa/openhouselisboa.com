var favouritePlaces = [];
var localStorage = window.localStorage;
var sharedList;
var sharedListParam;
var favouritesPage;

function localStorageSupported() {
  var testKey = 'test', storage = window.localStorage;
  try {
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
}

function showFavouriteButtons() {
  var addFavouriteButtons = document.getElementsByClassName("add-favourite");
  var removeFavouriteButtons = document.getElementsByClassName("remove-favourite");
  var favouritesButtons = document.getElementsByClassName("favourites-button");
  
  for (var i = 0; i < addFavouriteButtons.length; i++) {
    var element = addFavouriteButtons[i];
    element.removeAttribute("style");
  }

  for (var i = 0; i < removeFavouriteButtons.length; i++) {
    var element = removeFavouriteButtons[i];
    element.removeAttribute("style");
  }

  for (var i = 0; i < favouritesButtons.length; i++) {
    var element = favouritesButtons[i];
    element.removeAttribute("style");
  }
}

function favourite(idNumber) {
  var placeThumbs = document.querySelectorAll('[data-number="' + idNumber + '"]');
  if (favouritePlaces.indexOf(idNumber) === -1) {
    favouritePlaces.push(idNumber);
    for (var i = 0; i < placeThumbs.length; i++) {
      placeThumbs[i].classList.add("favourite");
    }
  } else {
    var spliceIndex = favouritePlaces.indexOf(idNumber);
    favouritePlaces.splice(spliceIndex, 1);
    for (var i = 0; i < placeThumbs.length; i++) {
      placeThumbs[i].classList.remove("favourite");
    }
  }
  saveFavourites();
  if (favouritesPage === true) {
    generateShareLinks();
  }
  
  ga('send', 'event', 'Favourites', 'add/remove favourite');
  
}

function saveFavourites() {
  var favouritesJson = JSON.stringify(favouritePlaces);
  try {
    localStorage.setItem("favouritePlaces" + siteYear, favouritesJson);
  } catch (e) {
    console.error(e.message);
  }  
}

function loadFavourites() {
  try {
    // if favouritePlaces does not exist in localStorage, create it
    if (!localStorage.getItem("favouritePlaces" + siteYear)) {
      localStorage.setItem("favouritePlaces" + siteYear, "[]");
    }
    
    // get favouritePlaces from localStorage and parse it
    favouritePlaces = JSON.parse(localStorage.getItem("favouritePlaces" + siteYear));
    
    // remove ".favourite" class from all elements
    var elementsMarkedAsFavourite = document.getElementsByClassName("favourite");
    for (var i = 0; i < elementsMarkedAsFavourite.length; i++) {
      var element = elementsMarkedAsFavourite[i];
      element.classList.remove("favourite");
    }
    
    // iterate over favouritePlaces and set ".favourite" class on corresponding elements
    for (var i = 0; i < favouritePlaces.length; i++) {
      var idNumber = favouritePlaces[i];
      var placeThumbs = document.querySelectorAll('[data-number="' + idNumber + '"]');
      for (var j = 0; j < placeThumbs.length; j++) {
        placeThumbs[j].classList.add("favourite");
      }
      var placeArticle = document.querySelector('.place[data-number="' + idNumber + '"]');
      if (placeArticle) {
        placeArticle.classList.add("favourite");
      }
    }
    
  } catch (e) {
    console.error(e.message);
  }
}

function loadList(sharedListParam) {
  sharedList = decodeFavourites(sharedListParam);
  
  // remove ".shared" class from all elements
  var elementsMarkedAsShared = document.getElementsByClassName("shared");
  for (var i = 0; i < elementsMarkedAsShared.length; i++) {
    var element = elementsMarkedAsShared[i];
    element.classList.remove("shared");
  }

  // iterate over sharedList and set ".shared" class on corresponding elements
  for (var i = 0; i < sharedList.length; i++) {
    var idNumber = sharedList[i];
    var placeThumbs = document.querySelectorAll('[data-number="' + idNumber + '"]');
    for (var j = 0; j < placeThumbs.length; j++) {
      placeThumbs[j].classList.add("shared");
    }
  }

  // remove all thumbnails not marked with ".shared" class
  $(".place-thumb-container:not(.shared)").remove();
  
  // show remaining thumbnails
  $(".place-thumb-container").show();
}

function updateFavouritesList() {
  $(".place-thumb-container:not(.favourite)").remove();
  $(".place-thumb-container").show();
}


function hexEncode(x) {
  x = parseInt(x).toString(16);
  return (x.length == 1) ? "0" + x : x;
}

function hexDecode(x) {
  return parseInt(x, 16);
}

function encodeFavourites() {
  var encodedFavourites = "";
  for (var i = 0; i < favouritePlaces.length; i++) {
    var place = favouritePlaces[i];
    var hex = hexEncode(place);
    encodedFavourites += hex;
  }
  return encodedFavourites;
}

function decodeFavourites(string) {
  var encodedArray = string.match(/.{1,2}/g);
  var decodedArray = [];
  for (var i = 0; i < encodedArray.length; i++) {
    var decodedNumber = hexDecode(encodedArray[i]);
    decodedArray.push(decodedNumber);
  }
  return decodedArray;
}



Base64 = {

    _Rixits :
//   0       8       16      24      32      40      48      56     63
//   v       v       v       v       v       v       v       v      v
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
    // You have the freedom, here, to choose the glyphs you want for 
    // representing your base-64 numbers. The ASCII encoding guys usually
    // choose a set of glyphs beginning with ABCD..., but, looking at
    // your update #2, I deduce that you want glyphs beginning with 
    // 0123..., which is a fine choice and aligns the first ten numbers
    // in base 64 with the first ten numbers in decimal.

    // This cannot handle negative numbers and only works on the 
    //     integer part, discarding the fractional part.
    // Doing better means deciding on whether you're just representing
    // the subset of javascript numbers of twos-complement 32-bit integers 
    // or going with base-64 representations for the bit pattern of the
    // underlying IEEE floating-point number, or representing the mantissae
    // and exponents separately, or some other possibility. For now, bail
    fromNumber : function(number) {
        if (isNaN(Number(number)) || number === null ||
            number === Number.POSITIVE_INFINITY)
            throw "The input is not valid";
        if (number < 0)
            throw "Can't represent negative numbers now";

        var rixit; // like 'digit', only in some non-decimal radix 
        var residual = Math.floor(number);
        var result = '';
        while (true) {
            rixit = residual % 64
            // console.log("rixit : " + rixit);
            // console.log("result before : " + result);
            result = this._Rixits.charAt(rixit) + result;
            // console.log("result after : " + result);
            // console.log("residual before : " + residual);
            residual = Math.floor(residual / 64);
            // console.log("residual after : " + residual);

            if (residual == 0)
                break;
            }
        return result;
    },

    toNumber : function(rixits) {
        var result = 0;
        // console.log("rixits : " + rixits);
        // console.log("rixits.split('') : " + rixits.split(''));
        rixits = rixits.split('');
        for (var e = 0; e < rixits.length; e++) {
            // console.log("_Rixits.indexOf(" + rixits[e] + ") : " + 
                // this._Rixits.indexOf(rixits[e]));
            // console.log("result before : " + result);
            result = (result * 64) + this._Rixits.indexOf(rixits[e]);
            // console.log("result after : " + result);
        }
        return result;
    }
}



function getParameterByName(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

var shareUrl = "http://www.openhouselisboa.com/list/?s=";
var facebookShareUrl = "https://www.facebook.com/share.php?u=";
var twitterShareUrl = "https://twitter.com/share?hashtags=openhouselisboa&original_referer=http://www.openhouselisboa.com&url=";
var emailShareUrl = "mailto:?body=";

function generateShareLinks() {
  var shareLinkContent = shareUrl + encodeFavourites();

  if (encodeFavourites() != "") {
    document.getElementById("list-share-container").removeAttribute("style");
  } else {
    document.getElementById("list-share-container").style.display = "none";
  }
  
  var shareLinkInput = document.getElementById("list-share-link");
  if (shareLinkInput) {
    shareLinkInput.value = shareLinkContent;
  }

  var facebookLink = document.getElementById("facebook-share");
  if (facebookLink) {
    facebookLink.setAttribute("href", facebookShareUrl + encodeURIComponent(shareLinkContent)); 
  }

  var twitterLink = document.getElementById("twitter-share");
  if (twitterLink) {
    twitterLink.setAttribute("href", twitterShareUrl + encodeURIComponent(shareLinkContent)); 
  }

  var emailLink = document.getElementById("email-share");
  if (emailLink) {
    emailLink.setAttribute("href", emailShareUrl + encodeURIComponent(shareLinkContent)); 
  }
}

function populateListShareLinks() {
  var shareLinkContent = shareUrl + sharedListParam;
  var languageSwitcherLink = document.querySelector(".language-switcher a");
  var listUrlParam;
  
  if (languageSwitcherLink) {
    if (languageSwitcherLink.innerHTML == "EN") {
      listUrlParam = "/en/list/?s=" + sharedListParam;
    } else {
      listUrlParam = "/list/?s=" + sharedListParam;
    }
    languageSwitcherLink.setAttribute("href", listUrlParam);
  }
  
  if (sharedListParam.length > 1) {
    document.getElementById("list-share-container").removeAttribute("style");
  } else {
    document.getElementById("list-share-container").style.display = "none";
  }

  var shareLinkInput = document.getElementById("list-share-link");
  if (shareLinkInput) {
    shareLinkInput.value = shareLinkContent;
  }

  var facebookLink = document.getElementById("facebook-share");
  if (facebookLink) {
    facebookLink.setAttribute("href", facebookShareUrl + encodeURIComponent(shareLinkContent)); 
  }

  var twitterLink = document.getElementById("twitter-share");
  if (twitterLink) {
    twitterLink.setAttribute("href", twitterShareUrl + encodeURIComponent(shareLinkContent)); 
  }

  var emailLink = document.getElementById("email-share");
  if (emailLink) {
    emailLink.setAttribute("href", emailShareUrl + encodeURIComponent(shareLinkContent)); 
  }
}

function showEmptyList() {
  document.getElementById("empty-list").removeAttribute("style");
}
