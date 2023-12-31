/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
// type is either name, email, password
export const updateSettings = async function (data, type) {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';
    const result = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if ((result.data.status = 'success')) {
      showAlert('success', `${type.toUpperCase()} updated successfully`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
