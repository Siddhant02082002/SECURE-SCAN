import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
const Second = () => {
  const [data, setData] = useState([]);
  const [load, setloading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:3000/api/dataFetch");
      setData(response.data);
      setloading(false);
    };

    fetchData();
  }, []);

  console.log(data);
  if (load) {
    return <div>Loading</div>;
  }
  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">API Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-200">
            <tr>
              {/* <th className="py-3 px-4 border-b">Method</th> */}
              <th className="py-3 px-4 border-b">Endpoint</th>
              <th className="py-3 px-4 border-b">Status</th>
              <th className="py-3 px-4 border-b">Vulnerabilities</th>
              <th className="py-3 px-4 border-b">Severity</th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index} className="text-center">
                  {/* <td className="py-3 px-4 border-b">{`/${item.fileName.replace('.json', '')}`}</td> */}
                  <td className="py-3 px-4 border-b">{`/${item.fileName.replace('.json', '')}`}</td>
                  <td className="py-3 px-4 border-b"><span className={item.High.types.length>0?`inline-block px-3 py-1 text-sm font-semibold rounded-full 
                    bg-red-500 text-white`:item.Medium.types.length>0 ? `inline-block px-3 py-1 text-sm font-semibold rounded-full 
                    bg-yellow-500 text-white`:`inline-block px-3 py-1 text-sm font-semibold rounded-full 
                    bg-green-500 text-white`}>{item.High.types.length>0? `Vulnerable`:item.Medium.types.length>0? `Partially Accepted`:`Secured`}</span></td>
                  <td>
                    <ul className="list-disc list-inside">
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
                      {item.Low && item.Low.types.length > 0 ? (
                        item.Low.types.map((point, pointIndex) => (
                          <li key={pointIndex}>{point}</li>
                        ))
                      ) : (
                        <></>
                      )}
                    </ul>
                  </td>
                  <td>
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
                  {/* <td className="py-3 px-4 border-b">{item.apiName}</td>
                  <td className="py-3 px-4 border-b">{item.endpoint}</td>
                  <td className="py-3 px-4 border-b">
                    <span
                      className={`inline-block px-3 py-1 text-sm font-semibold rounded-full 
                        ${
                          item.status === "Vulnerable"
                            ? "bg-red-500 text-white"
                            : "bg-green-500 text-white"
                        }
                      `}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b">
                    <ul className="list-disc list-inside">
                      {item.vulnerabilities.map((vuln, vulnIndex) => (
                        <li key={vulnIndex}>{vuln}</li>
                      ))}
                    </ul>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-3 px-4 text-center">
                  No data available
                </td>
              </tr>
            )}

            {/* <tr className="text-center">
              <td>POST</td>
              <td className="py-3 px-4 border-b">Reset Password</td>
              <td className="py-3 px-4 border-b">/reset-password</td>
              <td className="py-3 px-4 border-b">
                <span
                  className={`inline-block px-3 py-1 text-sm font-semibold rounded-full 
                    bg-red-500 text-white
                  }`}
                >
                  Vulnerable
                </span>
              </td>
              <td className="py-3 px-4 border-b">
                <ul className="list-disc list-inside">
                  <li>Broken Authentication</li>
                  <li>Sensitive Data Exposure</li>
                  <li>Broken Access Control</li>
                </ul>
              </td>
            </tr> */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Second;
