using WeatherApp.Server.Models;

namespace WeatherApp.Server.Services.Implementations
{
    public class OpenMeteoGeocodingService : IGeocodingService
    {
        private readonly HttpClient _http;
        private readonly string _geocodingUrl;

        public OpenMeteoGeocodingService(HttpClient http, IConfiguration config)
        {
            _http = http;
            _geocodingUrl = config["OpenMeteo:GeocodingUrl"]!;
        }

        public async Task<LocationResult?> GetCoordinatesAsync(string city)
        {
            var url = $"{_geocodingUrl}?name={Uri.EscapeDataString(city)}";
            var res = await _http.GetFromJsonAsync<GeocodingResponse>(url);
            return res?.Results?.FirstOrDefault();
        }
    }
}
