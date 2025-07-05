<script>
        document.addEventListener('DOMContentLoaded', function() {
            const videoContainers = document.querySelectorAll('.video-container');

            videoContainers.forEach(container => {
                const video = container.querySelector('video');
                const playButton = container.querySelector('.play-button');

                // Function to hide the button and play video
                function playVideo() {
                    if (video.paused) {
                        video.play();
                        playButton.style.display = 'none'; // Hide the button
                    }
                }

                // Function to show the button and pause video
                function pauseVideo() {
                    if (!video.paused) {
                        video.pause();
                        playButton.style.display = 'flex'; // Show the button
                    }
                }
            
                // Set initial state: show button if video is paused (which it usually is by default)
                if (video.paused) {
                    playButton.style.display = 'flex';
                } else {
                    playButton.style.display = 'none';
                }
            
                // Event listener for the custom play button
                playButton.addEventListener('click', playVideo);

                // Event listener for clicking on the video itself (to pause and show button)
                video.addEventListener('click', pauseVideo);

                // Event listener for when the video actually starts playing
                video.addEventListener('play', function() {
                    playButton.style.display = 'none';
                });

                // Event listener for when the video pauses (e.g., when it ends or user clicks pause)
                video.addEventListener('pause', function() {
                    playButton.style.display = 'flex';
                });
            });
        });
    </script>
