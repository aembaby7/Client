'use client';
import React, { useCallback, useState } from 'react';

import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  AdvancedMarkerProps,
  APIProvider,
  InfoWindow,
  Map,
  Pin,
  useAdvancedMarkerRef,
  CollisionBehavior,
} from '@vis.gl/react-google-maps';

import './style.css';

export type AnchorPointName = keyof typeof AdvancedMarkerAnchorPoint;

// A common pattern for applying z-indexes is to sort the markers
// by latitude and apply a default z-index according to the index position
// This usually is the most pleasing visually. Markers that are more "south"
// thus appear in front.
type MarkerData = Array<{
  id: string;
  position: google.maps.LatLngLiteral;
  type: 'pin' | 'html';
  zIndex: number;
  title: string;
}>;
// const data = getData()
//   .sort((a, b) => b.position.lat - a.position.lat)
//   .map((dataItem, index) => ({ ...dataItem, zIndex: index }));

// const Z_INDEX_SELECTED = 200;
// const Z_INDEX_HOVER = 200 + 1;

const API_KEY = 'AIzaSyCMkTsWihWaNp__Zn3rxCn_BddV8RzFmLs';

const LocationsView = ({ data1, position }: { data1: MarkerData; position: any }) => {
  console.log('position1111', position.lat);
  console.log('position12222', position.lng);
  data1
    .sort((a, b) => b.position.lat - a.position.lat)
    .map((dataItem, index) => ({ ...dataItem, zIndex: index }));

  const [markers] = useState(data1);

  const [hoverId, setHoverId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedInfo, setSelectedInfo] = useState<string | null>(null);

  const [anchorPoint, setAnchorPoint] = useState('BOTTOM' as AnchorPointName);
  const [selectedMarker, setSelectedMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  const onMouseEnter = useCallback((id: string | null) => setHoverId(id), []);
  const onMouseLeave = useCallback(() => setHoverId(null), []);
  const onMarkerClick = useCallback(
    (
      id: string | null,
      title: string | null,
      marker?: google.maps.marker.AdvancedMarkerElement
    ) => {
      setSelectedId(id);
      setSelectedInfo(title);

      if (marker) {
        setSelectedMarker(marker);
      }

      if (id !== selectedId) {
        setInfoWindowShown(true);
      } else {
        setInfoWindowShown((isShown) => !isShown);
      }
    },
    [selectedId]
  );

  const onMapClick = useCallback(() => {
    setSelectedId(null);
    setSelectedInfo(null);
    setSelectedMarker(null);
    setInfoWindowShown(false);
  }, []);

  const handleInfowindowCloseClick = useCallback(() => setInfoWindowShown(false), []);

  return (
    // defaultCenter={{ lat: position.lat, lng: position.long }}

    <APIProvider apiKey={API_KEY} libraries={['marker']}>
      <Map
        mapId={'bf51a910020fa25aT'}
        defaultZoom={12}
        defaultCenter={{ lat: Number(position.lat), lng: Number(position.lng) }}
        gestureHandling={'greedy'}
        onClick={onMapClick}
        clickableIcons={false}
        disableDefaultUI
      >
        {markers.map(({ id, zIndex: zIndexDefault, position, type, title }) => {
          let zIndex = zIndexDefault;

          if (hoverId === id) {
            zIndex = markers.length;
          }

          if (selectedId === id) {
            zIndex = markers.length + 1;
          }

          if (type === 'pin') {
            return (
              <AdvancedMarkerWithRef
                onMarkerClick={(marker: google.maps.marker.AdvancedMarkerElement) =>
                  onMarkerClick(id, title, marker)
                }
                onMouseEnter={() => onMouseEnter(id)}
                onMouseLeave={onMouseLeave}
                key={id}
                zIndex={zIndex}
                className="custom-marker"
                style={{
                  transform: `scale(${[hoverId, selectedId].includes(id) ? 1.3 : 1})`,
                  transformOrigin: AdvancedMarkerAnchorPoint['BOTTOM'].join(' '),
                }}
                position={position}
              >
                <Pin
                  background={selectedId === id ? '#22ccff' : null}
                  borderColor={selectedId === id ? '#1e89a1' : null}
                  glyphColor={selectedId === id ? '#0f677a' : null}
                />
              </AdvancedMarkerWithRef>
            );
          }

          if (type === 'html') {
            return (
              <React.Fragment key={id}>
                <AdvancedMarkerWithRef
                  position={position}
                  zIndex={zIndex}
                  anchorPoint={AdvancedMarkerAnchorPoint[anchorPoint]}
                  className="custom-marker"
                  style={{
                    transform: `scale(${[hoverId, selectedId].includes(id) ? 1.3 : 1})`,
                    transformOrigin: AdvancedMarkerAnchorPoint[anchorPoint].join(' '),
                  }}
                  onMarkerClick={(marker: google.maps.marker.AdvancedMarkerElement) =>
                    onMarkerClick(id, title, marker)
                  }
                  onMouseEnter={() => onMouseEnter(id)}
                  collisionBehavior={CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY}
                  onMouseLeave={onMouseLeave}
                >
                  <div
                    className={`custom-html-content ${selectedId === id ? 'selected' : ''}`}
                  ></div>
                </AdvancedMarkerWithRef>

                {/* anchor point visualization marker */}
                <AdvancedMarkerWithRef
                  onMarkerClick={(marker: google.maps.marker.AdvancedMarkerElement) =>
                    onMarkerClick(id, title, marker)
                  }
                  zIndex={zIndex + 1}
                  onMouseEnter={() => onMouseEnter(id)}
                  onMouseLeave={onMouseLeave}
                  anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
                  position={position}
                >
                  <div className="visualization-marker"></div>
                </AdvancedMarkerWithRef>
              </React.Fragment>
            );
          }
        })}

        {infoWindowShown && selectedMarker && (
          <InfoWindow
            anchor={selectedMarker}
            pixelOffset={[0, -2]}
            onCloseClick={handleInfowindowCloseClick}
          >
            <h2> {selectedId}</h2>
            <h3> {selectedInfo}</h3>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
};

export const AdvancedMarkerWithRef = (
  props: AdvancedMarkerProps & {
    onMarkerClick: (marker: google.maps.marker.AdvancedMarkerElement) => void;
  }
) => {
  const { children, onMarkerClick, ...advancedMarkerProps } = props;
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <AdvancedMarker
      onClick={() => {
        if (marker) {
          onMarkerClick(marker);
        }
      }}
      ref={markerRef}
      {...advancedMarkerProps}
    >
      {children}
    </AdvancedMarker>
  );
};

export default LocationsView;
