document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('comparisonForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const formData = new FormData(this);
        const data = {
            src_dir: formData.get('src_dir'),
            dst_dir: formData.get('dst_dir'),
            keywords: formData.get('keywords'),
            numbers: formData.get('numbers')
        };

        fetch('http://127.0.0.1:5000/process', { // Flask API 地址
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(data)
        })
        .then(response => response.json())
        .then(result => {
            document.getElementById('status').innerText = result.message;
            if (result.excel_file) {
                document.getElementById('status').innerHTML += `<br><a href="${result.excel_file}" download>Download Results</a>`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('status').innerText = 'An error occurred.';
        });
    });
});

