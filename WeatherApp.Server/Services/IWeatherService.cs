using WeatherApp.Server.Models;

namespace WeatherApp.Server.Services
{
    public interface IWeatherService
    {
        Task<WeatherResponse> GetWeatherAsync(double lat, double lon);
    }
}
