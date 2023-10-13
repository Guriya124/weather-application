const http = require("http");
const fs = require("fs");
var requests = require("requests");
// const port = 3000;

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (template, placeholder, value) => {
    return template.replace(placeholder, value);
}

const server = http.createServer((req, res) => {
    if (req.url === "/") {

        requests("https://api.openweathermap.org/data/2.5/weather?q=Hajipur&appid=c6caabfa79e45a7e9fd464d7effe6933")
            .on('data', (chunk) => {

                const objdata = JSON.parse(chunk);
                const arrdata = [objdata];

                const temperatureKelvin = arrdata[0].main.temp;
                const temperatureCelsius = (temperatureKelvin - 273.15).toFixed(2);

                const tempMinKelvin = objdata.main.temp_min;
                const tempMaxKelvin = objdata.main.temp_max;
                const tempMinCelsius = (tempMinKelvin - 273.15).toFixed(2);
                const tempMaxCelsius = (tempMaxKelvin - 273.15).toFixed(2);


                const location = objdata.name;
                const country = objdata.sys.country;
                const tempStatus = objdata.weather[0].main;



                let updatedHTML = homeFile;
                updatedHTML = replaceVal(updatedHTML, "{%tempval%}", `${temperatureCelsius} °C`);
                updatedHTML = replaceVal(updatedHTML, "{%tempmin%}", `${tempMinCelsius} °C`);
                updatedHTML = replaceVal(updatedHTML, "{%tempmax%}", `${tempMaxCelsius} °C`);
                updatedHTML = replaceVal(updatedHTML, "{%location%}", location);
                updatedHTML = replaceVal(updatedHTML, "{%country%}", country);
                updatedHTML = replaceVal(updatedHTML, " {%tempStatus%}", `${tempStatus}`);


                res.writeHead(200, { "Content-Type": "text/html" });
                res.write(updatedHTML);
                console.log(updatedHTML);

                // console.log(updatedHTML);

                // console.log(arrdata[0].main.temp);
            })
            .on('end', (err) => {

                if (err) return console.log("connection closed due to error", err);
                res.end();

            });

    }
});

server.listen(8000, "localhost");
