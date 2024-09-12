import React, { useState, useEffect } from "react";
import axios from "axios";

const Second = () => {
  const [data, setData] = useState([]);
  const [load, setloading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/dataFetch");
      setData(response.data);
      setloading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setloading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      await axios.post("http://localhost:3000/api/healthcheck");
      fetchData(); // Fetch the data again after the refresh request
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  if (load) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">API Dashboard</h1>
        <button
          onClick={handleRefresh}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          Refresh
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-300">
            <tr>
              <th className="py-3 px-4 border-b border-gray-300">Endpoint</th>
              <th className="py-3 px-4 border-b border-gray-300">Status</th>
              <th className="py-3 px-4 border-b border-gray-300">
                Vulnerabilities
              </th>
              <th className="py-3 px-4 border-b border-gray-300">Severity</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="py-3 px-4 border-b border-gray-300">
                    {`/${item.fileName.replace(".json", "")}`}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300">
                    <span
                      className={
                        item.High.types.length > 0
                          ? `inline-block px-3 py-1 text-sm font-semibold rounded-full 
                          bg-red-500 text-white`
                          : item.Medium.types.length > 0
                          ? `inline-block px-3 py-1 text-sm font-semibold rounded-full 
                          bg-yellow-500 text-white`
                          : `inline-block px-3 py-1 text-sm font-semibold rounded-full 
                          bg-green-500 text-white`
                      }
                    >
                      {item.High.types.length > 0
                        ? "Vulnerable"
                        : item.Medium.types.length > 0
                        ? "Partially Accepted"
                        : "Secured"}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300">
                    <ul className="style-none">
                      {item.High && item.High.types.length > 0 ? (
                        item.High.types.map((point, pointIndex) => (
                          <li key={pointIndex}>{point}</li>
                        ))
                      ) : (
                        <></>
                      )}
                      {item.Medium && item.Medium.types.length > 0 ? (
                        item.Medium.types.map((point, pointIndex) => (
                          <li key={pointIndex}>{point}</li>
                        ))
                      ) : (
                        <></>
                      )}
                      {item.Informational &&
                      item.Informational.types.length > 0 ? (
                        item.Informational.types.map((point, pointIndex) => (
                          <li key={pointIndex}>{point}</li>
                        ))
                      ) : (
                        <></>
                      )}
                      {item.Low && item.Low.types.length > 0 ? (
                        item.Low.types.map((point, pointIndex) => (
                          <li key={pointIndex}>{point}</li>
                        ))
                      ) : (
                        <></>
                      )}
                    </ul>
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300">
                    <ul className="style-none bg-red-500">
                      {item.High && item.High.types.length > 0 ? (
                        item.High.types.map((point, pointIndex) => (
                          <li key={pointIndex}>HIGH</li>
                        ))
                      ) : (
                        <></>
                      )}
                    </ul>
                    <ul className="style-none bg-yellow-500">
                      {item.Medium && item.Medium.types.length > 0 ? (
                        item.Medium.types.map((point, pointIndex) => (
                          <li key={pointIndex}>MEDIUM</li>
                        ))
                      ) : (
                        <></>
                      )}
                      <ul className="style-none bg-green-500">
                        {item.Informational && item.Informational.types.length > 0 ? (
                          item.Informational.types.map((point, pointIndex) => (
                            <li key={pointIndex}>LOW</li>
                          ))
                        ) : (
                          <></>
                        )}
                      </ul>
                    </ul>
                    <ul className="style-none bg-green-500">
                      {item.Low && item.Low.types.length > 0 ? (
                        item.Low.types.map((point, pointIndex) => (
                          <li key={pointIndex}>LOW</li>
                        ))
                      ) : (
                        <></>
                      )}
                    </ul>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="py-3 px-4 text-center border-b border-gray-300"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Second;
