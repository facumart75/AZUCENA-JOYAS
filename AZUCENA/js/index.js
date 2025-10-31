document.addEventListener('DOMContentLoaded', () => {
    // Selecciona la imagen principal usando su ID
    const mainImage = document.getElementById('mainImage');
    
    // Selecciona todas las miniaturas usando su clase
    const thumbnails = document.querySelectorAll('.thumbnail-item');

    // Verifica que ambos elementos existan antes de agregar los listeners
    if (mainImage && thumbnails.length > 0) {
        
        // Itera sobre cada miniatura para agregarle un detector de clic
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                
                // 1. Obtiene la ruta de la imagen grande guardada en el atributo 'data-full-img'
                const fullImgSrc = this.getAttribute('data-full-img');
                
                // 2. Cambia la fuente (src) de la imagen principal
                mainImage.src = fullImgSrc;
                
                // 3. Quita la clase 'active' de todas las miniaturas
                thumbnails.forEach(t => t.classList.remove('active'));
                
                // 4. Agrega la clase 'active' solo a la miniatura que fue clickeada
                this.classList.add('active');
            });
        });
        
        // Opcional: Resaltar la primera miniatura al cargar la página
        thumbnails[0].classList.add('active');
    }
});