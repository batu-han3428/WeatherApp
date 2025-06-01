using System.Globalization;
using WeatherApp.Server.Models;

namespace WeatherApp.Server.Services.Implementations
{
    public class OpenMeteoWeatherService : IWeatherService
    {
        private readonly HttpClient _http;
        private readonly string _baseUrl;

        public OpenMeteoWeatherService(HttpClient http, IConfiguration config)
        {
            _http = http;
            _baseUrl = config["OpenMeteo:BaseUrl"]!;
        }

        public async Task<WeatherResponse> GetWeatherAsync(double lat, double lon)
        {
            var latStr = lat.ToString(CultureInfo.InvariantCulture);
            var lonStr = lon.ToString(CultureInfo.InvariantCulture);
            var url = $"{_baseUrl}?latitude={latStr}&longitude={lonStr}&daily=temperature_2m_max,temperature_2m_min&timezone=auto";

            var response = await _http.GetAsync(url);
            if (!response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                throw new HttpRequestException($"API error: {response.StatusCode} \nContent: {content}");
            }

            return await response.Content.ReadFromJsonAsync<WeatherResponse>() ?? new WeatherResponse();
        }
    }
}
