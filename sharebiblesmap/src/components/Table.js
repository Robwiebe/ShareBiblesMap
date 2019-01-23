import React from 'react';

const Table = (props) => {
    return (
      <div>
        <table>
          <caption>Table of pin data in region</caption>
          <thead><tr><th>Key</th><th>Longitude</th><th>Latitude</th><th>Status</th></tr></thead><br />
          <tbody>
            {(props.pins) ? props.pins.map(pin => <tr key={pin.key}><td>{pin.key}</td><td>{pin.longitude}</td><td>{pin.latitude}</td><td>{pin.status}</td></tr>) : null}
          </tbody>
        </table>
      </div>
)}

export default Table;