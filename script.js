document.getElementById('comparisonForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const srcDir = document.getElementById('src_dir').value;
    const dstDir = document.getElementById('dst_dir').value;
    const keywords = document.getElementById('keywords').value;
    const numbers = document.getElementById('numbers').value;

    const formData = new FormData();
    formData.append('src_dir', srcDir);
    formData.append('dst_dir', dstDir);
    formData.append('keywords', keywords);
    formData.append('numbers', numbers);

    fetch('/process', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Processing successful") {
            document.getElementById('status').innerHTML = `Success! Download the results: <a href="${data.excel_file}" download>Download Excel</a>`;
        } else {
            document.getElementById('status').innerHTML = `Error: ${data.message}`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('status').innerHTML = 'Error processing the request.';
    });
});
