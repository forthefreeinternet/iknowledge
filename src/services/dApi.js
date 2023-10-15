// import axios from 'axios'
import daxios from '../daxios/index.js'
import localAdapter from '../daxios/lib/adapters/localAdapter.js'


export default () => {
  const axiosInstance = daxios.create({
    //baseURL: `${process.env.VUE_APP_URL}/api/v1`,
    baseURL: `/api/v1`,
    adapter: localAdapter
  })

  const token = localStorage.getItem('token')
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`
  }

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        location.reload()
      }
      return Promise.reject(error)
    }
  )

  return axiosInstance
}


// const baseURL = `/api/v1`;
// const request = require('supertest');
// const assert = require('assert');
// const express = require('express');

// const app = require('../server/app.js')

// app.get('/user', function(req, res) {
//   res.status(200).json({ name: 'john' });
// });

// request(app)
//   .get('/user')
//   .expect('Content-Type', /json/)
//   .expect('Content-Length', '15')
//   .expect(200)
//   .end(function(err, res) {
//     if (err) throw err;
//   });