const baseUrl = "https://lldev.thespacedevs.com/2.2.0/launch/upcoming/";
const currentDate = new Date().toISOString();

async function getFutureFloridaLaunches() {
  let allLaunches = [];
  let nextUrl = `${baseUrl}?limit=100&net__gte=${currentDate}`;

  while (nextUrl) {
    try {
      const response = await fetch(nextUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      
      // Filter launches in Florida
      const floridaLaunches = data.results.filter(launch => 
        launch.pad.location.name.includes("Florida") ||
        launch.pad.location.name.includes("Cape Canaveral") ||
        launch.pad.location.name.includes("Kennedy Space Center")
      );
      
      allLaunches = allLaunches.concat(floridaLaunches);
      nextUrl = data.next;
    } catch (error) {
      console.error("Error fetching launches:", error);
      break;
    }
  }
  return allLaunches;
}

getFutureFloridaLaunches()
  .then(launches => {
    console.log(`Total upcoming Florida launches: ${launches.length}`);
    launches.forEach(launch => {
      console.log(`${launch.net} - ${launch.name} - ${launch.pad.location.name}`);
    });
  })
  .catch(error => {
    console.error("There was a problem fetching the launches:", error);
  });
