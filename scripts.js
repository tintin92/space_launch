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
};

// Display upcoming launch list with details
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
};

// Get launch number count
function displayFutureLaunchCount(launches) {
  const containerCount = document.getElementById("upcoming-launch-number");

  // Clear previous content  
  containerCount.innerHTML = "";

  // Create a parapraph element to display the count
  const launchNumber = document.createElement("p");

  // Set the text content to the number of launches
  launchNumber.textContent = `Upcoming Launches: ${launches.length}`;

  // Append the paragraph to the container
  containerCount.appendChild(launchNumber);

}

getFutureFloridaLaunches()
  .then(launches => {
    console.log(`Total upcoming Florida launches: ${launches.length}`);
    displayFutureLaunchCount(launches);
    displayLaunches(launches);
  })
  .catch(error => {
    console.error("Error fetching the launches:", error);
    // document.getElementById("launches-container").innerHTML = "<p> Error loading launches. Please try again later. </p>";
  });
  
