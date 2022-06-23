

function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        const img = document.getElementById("img");
        data = reader.result;
        img.src = data;
        detectFaces(data);
      };

      reader.readAsDataURL(input.files[0]);
    }
  }

function showResult(result) { 
  const img = document.getElementById("img");
  var c = document.getElementById("myCanvas");
  c.width = img.width;
  c.height = img.height;
  var ctx = c.getContext("2d");
  ctx.drawImage(img, 0, 0);
  var faces = result.data.image.faces
  for (var i = 0; i < faces.length; i++) {
    var face = faces[i];
    var boundingBox = face.bounding_box;
    var width = boundingBox.right - boundingBox.left;
    var height = boundingBox.bottom - boundingBox.top;
    ctx.strokeStyle = "#EE4B2B";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.rect(boundingBox.left, boundingBox.top, width, height);
    ctx.stroke();
  }
}
function detectFaces(base64Image) {
  var accessKey = document.getElementById("access_key").value;
  var secretKey = document.getElementById("secret_key").value;
  var url = document.getElementById("url").value;
  if (accessKey == "" || secretKey == "" || url == "") {
    alert("Please fill access_key, secret_key or URL");
    return
  }
    const apiClient = new trustvisionSdk.default(
        accessKey, // access key
        secretKey,
        url,
      );
    data = base64Image.split(',').pop()
    apiClient
      .detectFaces({
        image: {
          base64: data, //Base64 encoded text of image1 data
          label: 'portrait', //label of the image as described at Upload Image API
        },
        collection: "", // index faces to this collection, optional
      })
      .then((result) => {
        if (result.errors != null && result.errors.length > 0) {
          alert(result.errors[0].message);
          return;
        }
          // please refer to API document for response's format
          console.log(result)
          showResult(result)  
      })
      .catch((error) => {
        alert(error);
      });
}