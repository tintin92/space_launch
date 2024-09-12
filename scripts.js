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

function displayLaunches(launches) {
  const container = document.getElementById("launches-container");
  container.innerHTML = ""; 

  if (launches.length === 0) {
    container.innerHTML = "<p> No upcoming launches found.</p>";
    return;
  }
  const launchList = document.createElement("ul");
  launches.forEach(launch => {
    const launchItem = document.createElement("li");
    launchItem.innerHTML = `
    <strong>${launch.name}</strong><br>
    Date: ${new Date(launch.net).toLocaleString()}
    <br>
    Location: ${launch.pad.location.name}
    `;
    launchList.appendChild(launchItem);
  });
  container.appendChild(launchList);
}

getFutureFloridaLaunches()
  .then(launches => {
    console.log(`Total upcoming Florida launches: ${launches.length}`);
      displayLaunches(launches);
  })
  .catch(error => {
    console.error("There was a problem fetching the launches:", error);
    document.getElementById("launches-containerf").innerHTML = "<p> Error loading launches. Please try again later. </p>";
  });
  
