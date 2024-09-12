function HomePage (){
    return (
        <div className="bg-gray-100 min-h-svh">
  
        <main className="container mx-auto p-3">
          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-4">What is this tool?</h2>
            <p className="text-lg text-gray-700">
              Our API Vulnerability Scanner helps you identify security weaknesses in your API endpoints. By providing detailed analysis and actionable insights, it ensures that your APIs are secure and compliant with industry standards.
            </p>
          </section>
  
          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-4">Key Features</h2>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
              <li>Automated scanning of API endpoints</li>
              <li>Detailed vulnerability reports</li>
              <li>Real-time monitoring and alerts</li>
              <li>Integration with CI/CD pipelines</li>
              <li>Comprehensive documentation</li>
            </ul>
          </section>
        </main>
      </div>
    );

    
}

export default HomePage;