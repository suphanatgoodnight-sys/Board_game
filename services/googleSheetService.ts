import { BorrowerInfo } from '../types';

// ใส่ URL ของ Apps Script ที่ deploy แล้ว
const GOOGLE_SHEET_API_URL =
  'https://script.google.com/macros/s/AKfycbznfXESLJAZ0RSZCyMyyUI0m6r6L310GYNDpDdwjHlT-stRX6glqBUZXezHJA6hNJSFxA/exec';

interface ApiResponse {
  status: 'success' | 'not_found' | 'error';
  message?: string;
  games?: string[];
}

interface ServiceResponse {
  success: boolean;
  message?: string;
}

export const recordBorrowing = async (borrowerInfo: BorrowerInfo): Promise<ServiceResponse> => {
  try {
    // We send one request for each borrowed game.
    // If any request fails, especially the first one with a student ID error, we stop.
    for (const gameName of borrowerInfo.games) {
      const payload = {
        action: 'borrow',
        Name: borrowerInfo.name,
        Student_ID: borrowerInfo.studentId,
        Classroom: borrowerInfo.classroom,
        Board_Game: gameName,
      };

      const response = await fetch(GOOGLE_SHEET_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });
      
      const text = await response.text();
      try {
        const result: ApiResponse = JSON.parse(text);
        if (result.status === 'error') {
          // If there's an error (like invalid student ID), stop and return the message.
          console.error('Error from Google Sheet:', result.message);
          return { success: false, message: result.message };
        }
      } catch (e) {
        // This handles cases where the response is not valid JSON
        console.error('Failed to parse JSON response from Google Sheet. Raw response:', text);
        return { success: false, message: 'An unexpected response was received from the server.' };
      }
    }

    // If all requests went through without an 'error' status
    return { success: true };

  } catch (error) {
    console.error('❌ Error sending to Google Sheet:', error);
    return { success: false, message: 'Failed to connect to the server.' };
  }
};

export const recordReturn = async (studentId: string, gameName: string): Promise<ServiceResponse> => {
  try {
    const payload = {
      action: 'return',
      Student_ID: studentId,
      Board_Game: gameName,
    };

    const response = await fetch(GOOGLE_SHEET_API_URL, {
      method: 'POST',
      headers: {
        // Change Content-Type to avoid CORS preflight request.
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    try {
      const result: ApiResponse = JSON.parse(text);
      if (result.status === 'success') {
        return { success: true, message: result.message };
      } else {
        // This will now handle the specific error "ไม่พบเลขประจำตัวนักเรียนที่ยืมบอร์ดเกม"
        return { success: false, message: result.message };
      }
    } catch (e) {
      console.error('Failed to parse JSON response on return. Raw response:', text);
      return { success: false, message: 'An unexpected response was received from the server.' };
    }
  } catch (error) {
    console.error('❌ Error sending return to Google Sheet:', error);
    return { success: false, message: 'Failed to connect to the server.' };
  }
};