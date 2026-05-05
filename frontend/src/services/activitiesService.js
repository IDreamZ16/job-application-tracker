import api from './api';

export const getActivities = async (jobId) => {
  const res = await api.get(`/api/jobs/${jobId}/activities`);
  return res.data.activities;
};

export const createActivity = async (jobId, data) => {
  const res = await api.post(`/api/jobs/${jobId}/activities`, data);
  return res.data.activity;
};

export const updateActivity = async (jobId, activityId, data) => {
  const res = await api.put(`/api/jobs/${jobId}/activities/${activityId}`, data);
  return res.data.activity;
};

export const deleteActivity = async (jobId, activityId) => {
  const res = await api.delete(`/api/jobs/${jobId}/activities/${activityId}`);
  return res.data;
};