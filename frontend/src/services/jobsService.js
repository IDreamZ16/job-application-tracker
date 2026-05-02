import api from './api';

export const getJobs = async () => {
  const res = await api.get('/api/jobs');
  return res.data.jobs;
};

export const getJob = async (id) => {
  const res = await api.get(`/api/jobs/${id}`);
  return res.data.job;
};

export const createJob = async (data) => {
  const res = await api.post('/api/jobs', data);
  return res.data.job;
};

export const updateJob = async (id, data) => {
  const res = await api.put(`/api/jobs/${id}`, data);
  return res.data.job;
};

export const deleteJob = async (id) => {
  const res = await api.delete(`/api/jobs/${id}`);
  return res.data;
};