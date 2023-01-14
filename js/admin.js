//global
var productList = [];
var src = "";

var mode = "create";

function domId(id) {
  return document.getElementById(id);
}

function submitForm() {
  if (mode === "create") createProduct();
  else if(mode === "update") updateProduct();
}

// const input = document.getElementById("file-input");
// const image = document.getElementById("img-preview");

// input.addEventListener("change", (e) => {
//   if (e.target.files.length) {
//     src = URL.createObjectURL(e.target.files[0]);
//     image.src = src;
//     console.log();
//     // return src;
//   }
// });

//CREATE PRODUCT
async function createProduct() {

  if (!checkValid()) return;
  mode="create";

  var id = domId("id").value;
  var name = domId("name").value;
  var price = +domId("price").value;
  var screen = domId("screen").value;
  var blackCamera = domId("blackCamera").value;
  var frontCamera = domId("frontCamera").value;
  var img = domId('img').value;
  var desc = domId("desc").value;
  var type = domId("type").value;

  if(type === "1"){
    type="iphone"
  }else if(type === "2"){
    type="samsung"
  }

  var product = new Product(
    name,
    price,
    screen,
    blackCamera,
    frontCamera,
    img,
    desc,
    type,
    id
  );

  var promise = productServices.createProduct(product);
  try {
    var res = await promise;
   
    fetchProductList();
  } catch (err) {
    console.log(err);
  }

  domId('form').reset();
  
}

// START CALL API TU BACKEND
function renderProduct(data) {
  //
  data = data || productList;

  var html = "";
  for (var i = 0; i < data.length; i++) {
    html += `<tr>
                       
    <td style="color: red">${data[i].id}</td>
    
      <td>${data[i].name}</td>
      <td>${data[i].price}</td>
      <td>${data[i].screen}</td>
      <td>${data[i].backCamera}</td>
      <td>${data[i].fontCamera}</td>
      <td><img style="height: 150px" src="${data[i].img}" alt=""></td>
      <td>${data[i].desc}</td>
      <td>${data[i].type}</td>
      <td class="actions">
      <a href="#addEmployeeModal" class="edit" data-backdrop="static" data-toggle="modal"><i class="material-icons"
                                    data-toggle="tooltip" data-backdrop="static" title="Edit" onclick="getUpdateProduct(${data[i].id})">&#xE254;</i></a>
      
            <button type="button" onclick="deleteProduct(${data[i].id})" class="btn btn-danger"><i class="fa fa-trash"></i></button>
                  
      </td>
  </tr>`;
  }
  // renderCart();
  domId("tagTbody").innerHTML = html;
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

//   DELETE PRODUCT

// LẤY DỮ LIỆU TỪ LOCALHOST 
function getProductCartList() {
  var productListJson = localStorage.getItem("PL");
  if (!productListJson) return [];
  // console.log(JSON.parse(productListJson));
  return JSON.parse(productListJson);
}
var cart  = getProductCartList();
console.log(cart);

function saveProductCartList() {
  var productListJson = JSON.stringify(cart);
  console.log(cart);
  localStorage.setItem("PL", productListJson);
}

async function deleteProduct(id) {
  var res = await productServices.deleteProduct(id);
  for (var i = 0; i < cart.length; i++) {
    if(id*1 === cart[i].product.id*1){
      cart.splice(i, 1);
    }
    
  }
  
  fetchProductList();
  saveProductCartList();
}

//update

function findById(id) {
  for (var i = 0; i < productList.length; i++) {
    if (productList[i].id === id) {
      return i;
    }
  }
  return -1;
}

function getUpdateProduct(id) {
  //call api backend => id => backend trả về chi tiết đối tượng sinh viên
  mode = "update";
  productServices
    .fetchProductDetail(id)
    .then(function (res) {

      // console.log(res);
      var product = res.data;

      console.log(product.type);

      domId("id").value = product.id;
      domId("name").value = product.name;
      domId("price").value = product.price;
      domId("screen").value = product.screen;
      domId("blackCamera").value = product.backCamera;
      domId("frontCamera").value = product.fontCamera;
      domId("img").value = product.img;
      domId("desc").value = product.desc;

      if(product.type==='iphone'){
        domId('type').value='1'
      }else if(product.type==='samsung'){
        domId('type').value='2'
      }

      // if(product.type === "1"){
      //   domId("type").value ='iphone';
      // }else if(domId('type').value === "2"){
      //   domId("type").value ='samsung';
      // }
    
      // domId("type").value = product.type;

      // khong cho user sua id => disable input masv

      var arrNotify = document.querySelectorAll('.sp-notify');
      for (let i = 0; i < arrNotify.length; i++) {
        arrNotify[i].innerHTML="";
        
      }

      domId("id").disabled = true;

      console.log(id, mode);

      //doi mode ="update"
      

    //   domID("btnAddUpdate").innerHTML = "Cập nhật";
    document.querySelector(".titleModal").innerHTML = "Update Product";
    domId('btnSubmit').innerHTML = "Update";
    //   domID("btnAddUpdate").classList.add("btn-info");

     document.querySelector('.btnCancelModal').onclick = cancelUpdate;

    domId('btnCloseModal').onclick = cancelUpdate;
    })
    .catch(function (err) {
      console.log(err);
    });
}

function cancelUpdate() {
    mode = "create";
    domId("id").disabled = false;
    domId('btnSubmit').innerHTML = "Add";
    domId('form').reset();
    document.querySelector(".titleModal").innerHTML = "Add Product";
    console.log(mode);
    
    // domID("form").reset();
    //mo input masv
    // domID("id").disabled = false;
}

function updateProduct() {

  if (!checkValid()) return;

  var idP = domId("id").value;
  var name = domId("name").value;
  var price = +domId("price").value;
  var screen = domId("screen").value;
  var blackCamera = domId("blackCamera").value;
  var frontCamera = domId("frontCamera").value;
  var img = domId("img").value;
  var desc = domId("desc").value;
  var type = domId("type").value;

  if(type === "1"){
    type="iphone"
  }else if(type === "2"){
    type="samsung"
  }

  var product = new Product(name, price, screen, blackCamera, frontCamera, img, desc, type, idP);

  productServices
    .updateProductDetail(product, idP)
    .then(function (res) {
      console.log(res);
      // alert("Cap nhat thanh cong");
      // domId('addEmployeeModal').style.display="none";
      // domId('addEmployeeModal').classList.remove('in');
      // var body = domId('body');
      // body.removeChild(body.lastChild);
      fetchProductList();
      cancelUpdate();
    })
    .catch(function (err) {
      console.log(err);
    });

  //update lại sp trong giỏ hàng của người dùng, nếu admin sửa thông tin sp
  
}

function required(val, config) {
  if (val.length > 0) {
    domId(config.errorId).innerHTML = "";
    return true;
  }
  domId(config.errorId).innerHTML = "Vui long nhap gia tri";

  return false;
}

function validRequiredForm(idFideld, idNotify) {
  var valueInput = domId(idFideld).value;

  var localCheck = required(valueInput, { errorId: idNotify });

  return localCheck;
}

//pattern
function pattern(val, config) {
  if (config.regexp.test(val)) {
    domId(config.errorId).innerHTML = "";
    return true;
  } else {
    domId(config.errorId).innerHTML = config.main;
    return false;
  }
}

function requiredType() {
  var valueInput = domId("type");
  var notify = domId("notifyType");

  if (valueInput.selectedIndex === 0) {
    notify.innerHTML = "Vui lòng chọn kiểu";
    return false;
  } else {
    notify.innerHTML = "";
    return true;
  }
}

function checkValid() {

  var idRegexp = /(^[0-9]{1,8}$)+/g;
  var nameRegexp = /([A-z]+)([0-9]*)+/g;
  var priceRegexp = /(^[0-9])+/g;
  var descRegexp = /^[a-zA-Z0-9 ]*$/;

  var validId = validRequiredForm("id", "notifyId") && 
                pattern(domId("id").value, {
                errorId: "notifyId",
                regexp: idRegexp,
                main: "id phai co từ 1 - 8 kí tự số",
              });;

  var validName = validRequiredForm("name", "notifyName") &&
                  pattern(domId("name").value, {
                    errorId: "notifyName",
                    regexp: nameRegexp,
                    main: "Tên sản phẩm phải là chữ và có ít nhất 0 hoặc nhiều kí tự số",
                  });

  var validPrice = validRequiredForm("price", "notifyPrice") &&
                    pattern(domId("price").value, {
                      errorId: "notifyPrice",
                      regexp: priceRegexp,
                      main: "Giá sản phẩm phải là số dương",
                    });

  var validScreen = validRequiredForm("screen", "notifyScreen");

  var validBackCamera = validRequiredForm("blackCamera", "notifyBackCamera");

  var validFrontCamera = validRequiredForm("frontCamera", "notifyFrontCamera");

  var validImg = validRequiredForm("img", "notifyImg");

  var validDesc = validRequiredForm("desc", "notifyDescription") &&
                  pattern(domId("desc").value, {
                    errorId: "notifyDescription",
                    regexp: descRegexp,
                    main: "Mo ta chua ro rang",
                  });

  var validType = requiredType();

  var valid = validId && validName && validPrice && validScreen && validBackCamera && validFrontCamera && validImg && validDesc && validType;
  // var valid = validId && validName;
  return valid;
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
window.onload = async function () {
  await fetchProductList();
  var productListFromLocal = getProductCartList();
  cart = mapProductCartList(productListFromLocal);
  console.log(productList);
};
