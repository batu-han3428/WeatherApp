using WeatherApp.Server.Models;

namespace WeatherApp.Server.Services
{
    public interface IGeocodingService
    {
        Task<LocationResult?> GetCoordinatesAsync(string city);
    }
}
