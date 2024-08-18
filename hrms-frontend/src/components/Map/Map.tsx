import React from "react";

// Define any props if necessary, here none are needed
interface MapProps {}

// Functional component with TypeScript
const Map: React.FC<MapProps> = () => {
  return (
    <div className="">
      <div style={{ width: "1500px", margin: "0px auto" }}>
        <iframe
          title="map"
          width="100%"
          height="800"
          frameBorder="0" // Correct attribute name in JSX
          scrolling="no"
          src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=eSparkBiz%20-%20Agile%20Teams%20On-demand,%201001%20-%201009%2010th%20floor%20City%20Center%202,%20Near%20Heer%20Party%20Plot,%20Sukan%20Mall%20Cross%20Road,%20Science%20City%20Rd,%20Sola,%20Ahmedabad,%20Gujarat%20380060+(My%20Business%20Name)&amp;t=k&amp;z=19&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
        >
          <a href="https://www.gps.ie/">gps tracker sport</a>
        </iframe>
      </div>
    </div>
  );
};

export default Map;
