// global
var productList = [];
var cart = [];

function domId(id) {
  return document.getElementById(id);
}
// START CALL API TU BACKEND
function renderProduct(data) {
  data = data || productList;

  var html = "";
  for (var i = 0; i < data.length; i++) {
    html += `<div class="item">
                <div class="card" >
                    <img src="${data[i].img}" class="card-img-top" alt="...">
                    <div class="card-body">
                    <h5 class="card-title"><a href="">${data[i].name}</a></h5>
                    <p class="card-text">${data[i].desc}</p>
                    <p class="price" id="priceProduct">${data[i].price}</p>

                    
                    </div>
                    <div class="card-footer">
                    <button class="btn btn-primary">Mua</button>
                    <button class="btn btn-warning" onclick="addToCart('${data[i].id}')"><i class="fa fa-shopping-cart"></i></button>
                    </div>
                </div>
            </div>`;
  }
  renderCart();
  domId("content").innerHTML = html;
}

async function fetchProductList() {
  productList = [];
  renderProduct();

  var promise = productServices.fetchProduct();

  try {
    var res = await promise;
    // await axios2();
    // await axios3();
    productList = mapProductList(res.data);
    renderProduct();
  } catch (err) {
    console.log(err);
  } finally {
    // document.getElementById("loader").style.display = "none";
  }
}

//lay du lieu tu api, day len giao dien
function mapProductList(local) {
  var result = [];

  for (var i = 0; i < local.length; i++) {
    var oldProduct = local[i];
    var newProduct = new Product(
      oldProduct.name,
      oldProduct.price,
      oldProduct.screen,
      oldProduct.backCamera,
      oldProduct.fontCamera,
      oldProduct.img,
      oldProduct.desc,
      oldProduct.type,
      oldProduct.id
    );
    result.push(newProduct);
  }

  return result;
}

//select product
var productFollowType = [];
function typePhone(data) {
  data = data || productList;

  var valueType = domId("selectType").value;
  if (valueType === "1") {
    var productFollowType = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i].type === "iphone") {
        productFollowType.push(data[i]);
        // console.log(data[i]);
        renderProduct(productFollowType);
      }
    }
  } else if (valueType === "2") {
    var productFollowType = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i].type === "samsung") {
        productFollowType.push(data[i]);
        renderProduct(productFollowType);
      }
    }
  } else {
    for (var i = 0; i < data.length; i++) {
      var productFollowType = productList;
      renderProduct(productFollowType);
    }
  }

  // var typeSelect = domId('selectType').value;
  // console.log(typeSelect);
}
//luu sp xuong local

// function typePhone(data) {
//   data = data || productList;
//   var isSelect = false;
//   var html = "";
//   var valueType = domId("selectType").value;
//   // for (var i = 0; i < data.length; i++) {
//   //   html+=`<option value="iphone">Iphone</option>`;
//   // }
//   // domId('optionType').innerHTML=html
//   for (var i = 0; i < data.length; i++) {
//     console.log(data[i].type);
//     if(valueType === data[i].type){
//       productFollowType.push(data[i]);
//       isSelect=true;
//     }
    
//   }
//   if(isSelect=true){
//     productFollowType=[];
//     for (var i = 0; i < data.length; i++) {
//       if(valueType === data[i].type){
//         productFollowType.push(data[i]);
//         isSelect=true;
//       }
      
//     }
//   }
//   if(valueType==="0"){
//     productFollowType=productList;
//   }
  
//   renderProduct(productFollowType);

//   // var typeSelect = domId('selectType').value;
//   // console.log(typeSelect);
// }




// END CALL API

// START CART

function addToCart(id) {
  productServices
    .fetchProductDetail(id) //lay thong tin 1 sp tu db
    .then(function (res) {
      var product = res.data;
      var quantity = 1;
      var cartItem = new CartItem(product, quantity);
      var isExist = false;

      for (var i = 0; i < cart.length; i++) {
        var itemCurrent = cart[i];
        if (itemCurrent.product.id === id) {
          cart[i].quantity++;
          isExist = true;
        }
      }
      if (isExist == false) {
        cart.push(cartItem);
      }

      console.log(cart);

      saveProductCartList();
      renderCart();
      var count = cart.length;
      domId("amount").innerHTML = count;
      renderCheckout();
    })
    .catch(function (err) {
      console.log(err);
    });
}

{
  /* <input type="text" class="form-control text-center" value="${cart[i].quantity}"
                          placeholder="" aria-label="Example text with button addon"
                          aria-describedby="button-addon1"></input> */
}

function renderCart() {
  var html = "";
  var totalCheck = 0;
  for (var i = 0; i < cart.length; i++) {
    html += `
              <tr>
              <td class="product-thumbnail">
                  <img class="img-cart" src="${cart[i].product.img}">
              </td>
              <td class="product-name">
                  <h2 class="h5 text-black">${cart[i].product.name}</h2>
              </td>
              <td>${cart[i].product.price}</td>
              <td>
                  <div class="input-group group-quantity" >
                      <div class="input-group-prepend">
                          <button onclick="changeAmount('${
                            cart[i].product.id
                          }', -1)" class="btn btn-outline-primary js-btn-minus reduce"
                              type="button">−</button>
                      </div>
                      
                          <p class="form-control text-center tdQuantity">${
                            cart[i].quantity
                          }</p>
                      <div class="input-group-append">
                          <button onclick="changeAmount('${
                            cart[i].product.id
                          }', 1)" class="btn btn-outline-primary js-btn-plus raise"
                              type="button">+</button>
                      </div>
                  </div>

              </td>
              <td>${cart[i].total()}</td>
              <td><button type="button" onclick="deleteProduct('${
                cart[i].product.id
              }')" class="btn btn-danger"><i class="fa fa-trash"></i></button></td>
          </tr>
          
    `;
    totalCheck += cart[i].total();
  }
  // console.log(total);
  domId("total").innerHTML = "Total: " + totalCheck;
  domId("cartProduct").innerHTML = html;
}

function changeAmount(id, number) {
  productServices
    .fetchProductDetail(id)
    .then(function (res) {
      var product = res.data;
      var isExist = false;

      var cartItem = new CartItem(product, quantity);
      for (var i = 0; i < cart.length; i++) {
        // var itemCurrent = cart[i];
        if (id === cart[i].product.id) {
          var quantity = cart[i].quantity * 1;
          var index = i;
          cart[i].quantity += number;
          isExist = true;
        }
        if (cart[i].quantity == 0) {
          cart.splice(index, 1);
          var count = cart.length;
          domId("amount").innerHTML = count;
        }
      }
      if (isExist == false) {
        cart.push(cartItem);
      }

      console.log(cart);
      saveProductCartList();
      renderCart();
      renderCheckout();
    })
    .catch(function (err) {
      console.log(err);
    });
}

function deleteProduct(id) {
  productServices
    .fetchProductDetail(id)
    .then(function (res) {
      var product = res.data;
      
      for (var i = 0; i < cart.length; i++) {
        if(id === cart[i].product.id){
          var index = i;
          cart.splice(index, 1);
          console.log(id);
        }
                
        
      }
      
      saveProductCartList();
      renderCart();
      renderCheckout();
      var count = cart.length;
  domId("amount").innerHTML = count;
    })
    .catch(function (err) {
      console.log(err);
    });
}

// END CART

//START CHECKOUT
function renderCheckout() {
  var html = "";
  var totalCheck = 0;
  for (var i = 0; i < cart.length; i++) {
    html += `
          <div class="_1_product">
          <p class="nameProduct">
              ${cart[i].quantity}x
             ${cart[i].product.name}
          </p>
          <p class="priceProduct">${cart[i].total()}</p>
      </div>
    `;
    totalCheck += cart[i].total();
  }
  document.querySelector(".payment p").innerHTML = "Payment: " + totalCheck;
  document.querySelector(".checkout_top .bill").innerHTML = html;
}
function order() {
  cart = [];
  var count = cart.length;
  domId("amount").innerHTML = count;
  console.log(cart);
  renderCart();
  renderCheckout();
  saveProductCartList();
  document.querySelector('.checkout').classList.remove('translate-right');
  document.querySelector(".cart").classList.remove("translate-left");
}

function clearProductCart() {
  cart = [];
  var count = cart.length;
  domId("amount").innerHTML = count;
  saveProductCartList();
  renderCart();
  renderCheckout();
  document.querySelector(".cart").classList.remove("translate-left");
  
}
//END CHECKOUT

function saveProductCartList() {
  var productListJson = JSON.stringify(cart);
  localStorage.setItem("PL", productListJson);
}
function getProductCartList() {
  var productListJson = localStorage.getItem("PL");
  if (!productListJson) return [];
  return JSON.parse(productListJson);
}
function mapProductCartList(local) {
  var result = [];
  for (var i = 0; i < local.length; i++) {
    var oldCart = local[i];
    var newCartItem = new CartItem(oldCart.product, oldCart.quantity);
    result.push(newCartItem);
  }
  
  return result;
}

// LOAD DU LIEU

window.onload = async function () {
  await fetchProductList(); // return promsise
  //load cart tu local
  var productListFromLocal = getProductCartList();
  cart = mapProductCartList(productListFromLocal);
  var count = cart.length;
  domId("amount").innerHTML = count;
  renderCart();
  renderCheckout();
};


domId("btn-shopping-cart").onclick = function () {
  if(cart.length===0){
    document.querySelector(".cart").classList.remove("translate-left");
    
  }else{
    document.querySelector(".cart").classList.add("translate-left");
  }
  
};

document.querySelector(".cart .btnClose p").onclick = function () {
  document.querySelector(".cart").classList.remove("translate-left");
};

domId('btnCheckout').onclick=function () {
  document.querySelector('.checkout').classList.add('translate-right');
}
document.querySelector('.checkout_bottom .btnCancel').onclick=function () {
  document.querySelector('.checkout').classList.remove('translate-right');
}