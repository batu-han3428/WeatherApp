using Microsoft.AspNetCore.Mvc;
using WeatherApp.Server.Services;

namespace WeatherApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WeatherController : ControllerBase
    {
        private readonly IGeocodingService _geoService;
        private readonly IWeatherService _weatherService;

        public WeatherController(IGeocodingService geoService, IWeatherService weatherService)
        {
            _geoService = geoService;
            _weatherService = weatherService;
        }

        [HttpGet("city")]
        public async Task<IActionResult> GetWeatherByCity([FromQuery] string city)
        {
            var location = await _geoService.GetCoordinatesAsync(city);
            if (location == null) return NotFound("Şehir bulunamadı");

            var weather = await _weatherService.GetWeatherAsync(location.Latitude, location.Longitude);
            weather.WithLocation(location);
            return Ok(weather);
        }
    }
}
