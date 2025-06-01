import { useState } from "react";
import axios from "axios";
import {
    Container,
    TextField,
    Typography,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    Box,
} from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CloudIcon from "@mui/icons-material/Cloud";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import SearchIcon from "@mui/icons-material/Search";

const WeatherCard = ({
    date,
    tempMax,
    tempMin,
}: {
    date: string;
    tempMax: number;
    tempMin: number;
}) => {
    const icon =
        tempMax > 25 ? (
            <WbSunnyIcon fontSize="large" sx={{ color: "#f57c00" }} />
        ) : tempMax < 10 ? (
            <AcUnitIcon fontSize="large" sx={{ color: "#0288d1" }} />
        ) : (
            <CloudIcon fontSize="large" sx={{ color: "#546e7a" }} />
        );

    return (
        <Card
            elevation={4}
            sx={{
                borderRadius: 4,
                backgroundColor: "#f0f4f8",
                transition: "transform 0.3s ease",
                "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                },
            }}
        >
            <CardContent sx={{ textAlign: "center" }}>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 700, color: "#37474f" }}
                >
                    {new Date(date).toLocaleDateString(undefined, {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                    })}
                </Typography>

                <Box sx={{ mb: 1 }}>{icon}</Box>

                <Box
                    display="flex"
                    justifyContent="center"
                    gap={4}
                    fontWeight={600}
                    fontSize="1.25rem"
                    color="#455a64"
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={0.5}
                        color="#d32f2f"
                        sx={{ userSelect: "none" }}
                    >
                        🔥 <span>{tempMax.toFixed(1)}°C</span>
                    </Box>
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={0.5}
                        color="#1976d2"
                        sx={{ userSelect: "none" }}
                    >
                        ❄️ <span>{tempMin.toFixed(1)}°C</span>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

function App() {
    const [city, setCity] = useState("");
    const [forecast, setForecast] = useState<
        { date: string; tempMax: number; tempMin: number }[]
    >([]);
    const [loading, setLoading] = useState(false);
    const [locationInfo, setLocationInfo] = useState<{ city?: string; admin1?: string; country?: string }>({});

    const handleSearch = async () => {
        if (!city) return;
        setLoading(true);

        try {
            const response = await axios.get(
                `https://localhost:7216/api/weather/city?city=${encodeURIComponent(city)}`
            );

            const { daily, city: cityName, admin1, country } = response.data;

            if (
                !daily ||
                !daily.time ||
                !daily.temperature_2m_Max ||
                !daily.temperature_2m_Min
            ) {
                throw new Error("Hava durumu verisi eksik.");
            }

            setLocationInfo({ city: cityName, admin1, country });

            const forecastData = daily.time.map((date: string, index: number) => ({
                date,
                tempMax: daily.temperature_2m_Max[index],
                tempMin: daily.temperature_2m_Min[index],
            }));

            setForecast(forecastData);
        } catch (err) {
            alert("Şehir bulunamadı veya veri alınamadı.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <Typography
                variant="h3"
                align="center"
                gutterBottom
                fontWeight={600}
                sx={{ color: "#263238" }}
            >
                🌤️ Hava Durumu Uygulaması
            </Typography>
            <Box display="flex" gap={2} mb={4} justifyContent="center">
                <TextField
                    variant="outlined"
                    label="Şehir Girin"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    sx={{ width: "300px" }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch();
                        }
                    }}
                />
                <SearchIcon
                    onClick={handleSearch}
                    fontSize="large"
                    sx={{ cursor: "pointer", color: "#1976d2", mt: 1.5 }}
                />
            </Box>

            {locationInfo.city && (
                <Box
                    sx={{
                        backgroundColor: "#e3f2fd",
                        borderRadius: 3,
                        px: 4,
                        py: 2,
                        mb: 4,
                        boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                        textAlign: "center",
                        maxWidth: 400,
                        color: "#1565c0",
                    }}
                >
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        {locationInfo.city}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {locationInfo.admin1 && <>{locationInfo.admin1}, </>}
                        {locationInfo.country}
                    </Typography>
                </Box>
            )}

            {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={2} justifyContent="center">
                    {forecast.map(({ date, tempMax, tempMin }) => (
                        <Grid key={date}>
                            <WeatherCard date={date} tempMax={tempMax} tempMin={tempMin} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}


export default App;
