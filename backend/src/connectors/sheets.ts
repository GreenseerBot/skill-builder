import { Connector } from '../types';

export const sheetsConnector: Connector = {
  id: 'sheets',
  name: 'Google Sheets',
  icon: '📊',
  description: 'Google Sheets — read, write, and manage spreadsheet data',
  authType: 'bearer',
  authEnvVar: 'GOOGLE_ACCESS_TOKEN',
  baseUrl: 'https://sheets.googleapis.com/v4/spreadsheets',
  defaultHeaders: {
    'Authorization': 'Bearer ${GOOGLE_ACCESS_TOKEN}',
    'Content-Type': 'application/json'
  },
  endpoints: [
    {
      id: 'sheets-read-range',
      name: 'Read Range',
      method: 'GET',
      path: '/{spreadsheetId}/values/{range}',
      description: 'Read values from a spreadsheet range',
      params: [
        { name: 'spreadsheetId', type: 'string', required: true, in: 'path', description: 'Spreadsheet ID' },
        { name: 'range', type: 'string', required: true, in: 'path', description: 'A1 notation range (e.g. Sheet1!A1:D10)' },
        { name: 'valueRenderOption', type: 'string', required: false, description: 'FORMATTED_VALUE, UNFORMATTED_VALUE, FORMULA' }
      ],
      responseFields: [
        { name: 'range', type: 'string', description: 'The range read' },
        { name: 'values', type: 'array', description: '2D array of cell values' },
        { name: 'majorDimension', type: 'string', description: 'ROWS or COLUMNS' }
      ]
    },
    {
      id: 'sheets-write-range',
      name: 'Write Range',
      method: 'PUT',
      path: '/{spreadsheetId}/values/{range}',
      description: 'Write values to a spreadsheet range',
      params: [
        { name: 'spreadsheetId', type: 'string', required: true, in: 'path', description: 'Spreadsheet ID' },
        { name: 'range', type: 'string', required: true, in: 'path', description: 'A1 notation range' },
        { name: 'valueInputOption', type: 'string', required: true, description: 'RAW or USER_ENTERED' },
        { name: 'values', type: 'array', required: true, description: '2D array of values to write' }
      ],
      responseFields: [
        { name: 'updatedRange', type: 'string', description: 'Range that was updated' },
        { name: 'updatedRows', type: 'number', description: 'Number of rows updated' },
        { name: 'updatedCells', type: 'number', description: 'Number of cells updated' }
      ]
    },
    {
      id: 'sheets-append-rows',
      name: 'Append Rows',
      method: 'POST',
      path: '/{spreadsheetId}/values/{range}:append',
      description: 'Append rows to the end of a sheet',
      params: [
        { name: 'spreadsheetId', type: 'string', required: true, in: 'path', description: 'Spreadsheet ID' },
        { name: 'range', type: 'string', required: true, in: 'path', description: 'Target range (e.g. Sheet1!A:A)' },
        { name: 'valueInputOption', type: 'string', required: true, description: 'RAW or USER_ENTERED' },
        { name: 'values', type: 'array', required: true, description: 'Rows to append' }
      ],
      responseFields: [
        { name: 'updates.updatedRange', type: 'string', description: 'Range that was appended to' },
        { name: 'updates.updatedRows', type: 'number', description: 'Rows appended' }
      ]
    },
    {
      id: 'sheets-create',
      name: 'Create Spreadsheet',
      method: 'POST',
      path: '/',
      description: 'Create a new spreadsheet',
      params: [
        { name: 'properties.title', type: 'string', required: true, description: 'Spreadsheet title' },
        { name: 'sheets', type: 'array', required: false, description: 'Initial sheet definitions' }
      ],
      responseFields: [
        { name: 'spreadsheetId', type: 'string', description: 'New spreadsheet ID' },
        { name: 'spreadsheetUrl', type: 'string', description: 'URL to the spreadsheet' }
      ]
    },
    {
      id: 'sheets-get',
      name: 'Get Spreadsheet',
      method: 'GET',
      path: '/{spreadsheetId}',
      description: 'Get spreadsheet metadata and sheet list',
      params: [
        { name: 'spreadsheetId', type: 'string', required: true, in: 'path', description: 'Spreadsheet ID' }
      ],
      responseFields: [
        { name: 'spreadsheetId', type: 'string', description: 'Spreadsheet ID' },
        { name: 'properties.title', type: 'string', description: 'Spreadsheet title' },
        { name: 'sheets', type: 'array', description: 'List of sheets with properties' }
      ]
    }
  ]
};
