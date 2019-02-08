import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';
import compare from 'compare-objects';

import './AlertsMap.css';

class AlertsMap extends Component {
  areaStyle = new window.mapkit.Style({
    strokeColor: "#db2828",
    strokeOpacity: .3,
    fillColor: '#db2828',
    fillOpacity: .1,
    lineWidth: 2,
    lineJoin: "round"
  });

  renderOverlays(props) {
    // Remove current overlays
    this._map.removeOverlays(this._map.overlays);

    this.minLatitude = null;
    this.maxLatitude = null;
    this.minLongitude = null;
    this.maxLongitude = null;

    // Create overlays for the hits
    if (props.hits) {
      props.hits.forEach(hit => {
        if (!hit.info.areas) return;

        hit.info.areas.forEach(area => {
          if (!area.polygons) return;

          // POLYGONS
          area.polygons.forEach(polygon => {
              // Create the mapkit overlay
              let points = polygon.coordinates.map(coordinates => {
                return coordinates.map(coordPair => {
                  this.minLatitude = this.minLatitude ? Math.min(this.minLatitude, coordPair[1]) : coordPair[1];
                  this.maxLatitude = this.maxLatitude ? Math.max(this.maxLatitude, coordPair[1]) : coordPair[1];
                  this.minLongitude = this.minLongitude ? Math.min(this.minLongitude, coordPair[0]) : coordPair[0];
                  this.maxLongitude = this.maxLongitude ? Math.max(this.maxLongitude, coordPair[0]) : coordPair[0];
                  return new window.mapkit.Coordinate(coordPair[1], coordPair[0]);
                });
              })

              var overlay = new window.mapkit.PolygonOverlay(points, {
                style: this.areaStyle,
                data: hit
              });
              this._map.addOverlay(overlay);
          });
        });
      });
    }

    if (this.minLatitude !== null && this.maxLatitude !== null && this.minLongitude !== null && this.maxLongitude !== null) {
      this._map.setRegionAnimated(new window.mapkit.BoundingRegion(this.maxLatitude, this.maxLongitude, this.minLatitude, this.minLongitude).toCoordinateRegion());
    }
  }

  componentDidUpdate(oldProps) {
    var changed = false;
    compare(this.props.hits, oldProps.hits, (k, v, ov) => changed = changed || v !== ov);
    if (changed) {
      this.renderOverlays(this.props);
    }
  }

  componentDidMount() {
    this._map = new window.mapkit.Map(this._mapEl, {
      center: new window.mapkit.Coordinate(62.076422, -107.4104419),
      tintColor: '#db2828',
      isRotationEnabled: true,
      isZoomEnabled: true,
      showsUserLocation: true,
      isScrollEnabled: true,
      tracksUserLocation: false
    });

    this._map.addEventListener('select', e => {
      if (!this.props.selectable) {
        return;
      }

      if (e.overlay) {
        this.props.history.push({
          pathname: `/alerts/${e.overlay.data.id}`,
          state: { modal: true, hit: e.overlay.data }
        });
      }
    });

    this.renderOverlays(this.props);
  }

  componentWillUnmount() {
    this._map.destroy();
  }

  render() {
    return (<div className="map" ref={e => (this._mapEl = e)} style={{ height: this.props.height }} />);
  }
}

export default withRouter(AlertsMap);
