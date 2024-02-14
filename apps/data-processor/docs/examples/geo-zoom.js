/**
 * Geographical zoom configuration.
 * @typedef {Object} GeoZoomOptions
 * @type {[number, number]} center - Center longitude/latitude pair.
 * @type {[number, number]} zoomLevels - Min/max pair of zoom levels.
 * @type {number} [initialZoom] - Initial zoom level.
 */

/**
 * @type {GeoZoomOptions}
 */
var INDIANA_ZOOM_CONFIG = {
  center: [86.44305475, 39.76622477],
  zoomLevels: [6400, 250000]
}

/**
 * Adds zooming functionality to a vega spec with a geographic projection.
 *
 * @param {any} spec - The vega specification object.
 * @param {GeoZoomOptions} opts - The zoom configuration.
 */
function addGeoZoom(spec, opts) {
  var signals = spec.signals || (spec.signals = []);
  var projection = spec.projections[0]; // Assumes single geo projection

  signals.push(
    { name: 'tx', update: 'width / 2' },
    { name: 'ty', update: 'height / 2' },
    {
      name: 'scale',
      value: opts.initialZoom != null ? opts.initialZoom : opts.zoomLevels[0],
      on: [{
        events: { type: 'wheel', consume: true },
        update: [
          'clamp(scale * pow(1.0015, -event.deltaY * pow(16, event.deltaMode)), ',
          opts.zoomLevels[0],
          ', ',
          opts.zoomLevels[1],
          ')'
        ].join('')
      }]
    },
    {
      name: 'angles',
      value: [0, 0],
      on: [{
        events: 'mousedown',
        update: '[rotateX, centerY]'
      }]
    },
    {
      name: 'cloned',
      value: null,
      on: [{
        events: 'mousedown',
        update: 'copy("' + projection.name + '")'
      }]
    },
    {
      name: 'start',
      value: null,
      on: [{
        events: 'mousedown',
        update: 'invert(cloned, xy())'
      }]
    },
    {
      name: 'drag',
      value: null,
      on: [{
        events: '[mousedown, window:mouseup] > window:mousemove',
        update: 'invert(cloned, xy())'
      }]
    },
    {
      name: 'delta',
      value: null,
      on: [{
        events: { signal: 'drag' },
        update: '[drag[0] - start[0], start[1] - drag[1]]'
      }]
    },
    {
      name: 'rotateX',
      value: opts.center[0],
      on: [{
        events: { signal: 'delta' },
        update: 'angles[0] + delta[0]'
      }]
    },
    {
      name: 'centerY',
      value: opts.center[1],
      on: [{
        events: { signal: 'delta' },
        update: 'clamp(angles[1] + delta[1], -60, 60)'
      }]
    }
  );

  Object.assign(projection, {
    scale: { signal: 'scale' },
    rotate: [{ signal: 'rotateX' }, 0, 0],
    center: [0, { signal: 'centerY' }],
    translate: [{ signal: 'tx' }, { signal: 'ty' }]
  });
  delete projection.size;
}

/**
 * Patches a vega specification to add geographical zooming focused on Indiana.
 *
 * @param {any} spec - The vega specification object.
 */
function patchIndianaGeoZoom(spec) {
  addGeoZoom(spec, INDIANA_ZOOM_CONFIG)
  return spec;
}
