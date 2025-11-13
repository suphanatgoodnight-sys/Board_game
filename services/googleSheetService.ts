
import { BorrowerInfo } from '../types';

// ใส่ URL ของ Apps Script ที่ deploy แล้ว
const GOOGLE_SHEET_API_URL =
  'https://script.google.com/macros/s/AKfycbwMAVU911bfBxh--PDg1l15W0qM3EflxVv-KVLMlV34LpuZnJBZeRtkjq8lqky6g8sRTQ/exec';

export const recordBorrowing = async (borrowerInfo: BorrowerInfo): Promise<boolean> => {
  try {
    // The Apps Script seems to expect one game per request to update statuses correctly.
    // We send one request for each borrowed game.
    const requests = borrowerInfo.games.map(gameName => {
      const payload = {
        action: 'borrow',
        Name: borrowerInfo.name,
        Student_ID: borrowerInfo.studentId,
        Classroom: borrowerInfo.classroom,
        Board_Game: gameName,
      };

      return fetch(GOOGLE_SHEET_API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    });

    await Promise.all(requests);

    // With 'no-cors', we cannot read the response, so we assume the request was successful.
    return true;
  } catch (error) {
    console.error('❌ Error sending to Google Sheet:', error);
    return false;
  }
};

export const recordReturn = async (studentId: string, gameName: string): Promise<boolean> => {
  try {
    const payload = {
      action: 'return',
      Student_ID: studentId,
      Board_Game: gameName,
    };

    await fetch(GOOGLE_SHEET_API_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // With 'no-cors', we cannot read the response, so we assume the request was successful.
    return true;
  } catch (error) {
    console.error('❌ Error sending return to Google Sheet:', error);
    return false;
  }
};
