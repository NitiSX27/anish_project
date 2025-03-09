// Weather Form Submission
document.getElementById('weatherForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = document.getElementById('cityInput').value;
    const weatherCards = document.getElementById('weatherCards');
    weatherCards.innerHTML = '<p>Loading weather data...</p>';
  
    try {
      const response = await fetch(`/weather?city=${encodeURIComponent(city)}`);
      const data = await response.json();
  
      if (data.error) throw new Error(data.error);
  
      let cardsHTML = `
        <div class="card">
          <h3>Current Weather</h3>
          <p>Temperature: ${data.current.temp_c}°C</p>
          <p>Condition: ${data.current.condition.text}</p>
          <p>Humidity: ${data.current.humidity}%</p>
        </div>`;
  
      data.forecast.forecastday.forEach((day, index) => {
        const dayLabel = index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : day.date;
        cardsHTML += `
          <div class="card">
            <h3>${dayLabel}</h3>
            <p>Max Temp: ${day.day.maxtemp_c}°C</p>
            <p>Min Temp: ${day.day.mintemp_c}°C</p>
            <p>Condition: ${day.day.condition.text}</p>
          </div>`;
      });
  
      weatherCards.innerHTML = cardsHTML;
    } catch (error) {
      weatherCards.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  });
  
  // Leaf Detection Form Submission
  document.getElementById('leafForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const leafImage = document.getElementById('leafImage').files[0];
    const leafResult = document.getElementById('leafResult');
    leafResult.innerHTML = '<p>Analyzing leaf...</p>';
  
    const formData = new FormData();
    formData.append('image', leafImage);
  
    try {
      const response = await fetch('/predict', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
  
      if (data.error) throw new Error(data.error);
  
      leafResult.innerHTML = `
        <p><strong>Result:</strong> ${data.disease}</p>
        <p><em>Confidence:</em> ${(data.confidence * 100).toFixed(2)}%</p>`;
    } catch (error) {
      leafResult.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  });