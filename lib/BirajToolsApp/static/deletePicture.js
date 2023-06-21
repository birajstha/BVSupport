
function deletePicture(url) {
// Send an AJAX request to delete the picture
fetch(url, {
    method: 'POST',
    body: JSON.stringify({ _method: 'DELETE' }),
})
    .then(response => response)
    .then(data => {
    // Handle the response data or perform any necessary actions
    console.log(data);
    // Reload the page
    location.reload();
    })
    .catch(error => {
    // Handle any errors
    console.error(error);
    });
}

