import axios from 'axios';

export const Login = async (params) => {
  try {
    var data = JSON.stringify(params);

    var config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://stacks-grant-backend.herokuapp.com/api/v1/user',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    return axios(config).then(function (response) {
      return response.data;
    })
      .catch(function (error) {
        console.log(error);
      });
  } catch (err) {
    return false;
  }
}

export const grantOnboarding = async (params) => {
  try {
    var data = JSON.stringify(params);
    console.log("data is here", data)
    var config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: ' https://stacks-grant-backend.herokuapp.com/api/v1/grant',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    return axios(config).then(function (response) {
      return response.data;
    })
      .catch(function (error) {
        console.log(error);
      });
  } catch (err) {
    return false;
  }
}

export const adminCreateUser = (params) => {
  try {
    var data = JSON.stringify(params);

    var config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://stacks-grant-backend.herokuapp.com/api/v1/admin/user',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data

    };

    return axios(config).then(function (response) {
      return response.data;
    })
      .catch(function (error) {
        console.log(error);
        return false;
      });

  } catch (err) {
    return false;
  }
}

export const adminUpdateUser = (params) => {
  try {
    var data = JSON.stringify(params);

    var config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: 'https://stacks-grant-backend.herokuapp.com/api/v1/admin/user',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data

    };

    return axios(config).then(function (response) {
      return response.data;
    })
      .catch(function (error) {
        console.log(error);
        return false;
      });

  } catch (err) {
    return false;
  }
}

export const adminGetAllUsers = () => {
  try {

    var config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://stacks-grant-backend.herokuapp.com/api/v1/admin/user/list',
      headers: {
        'Content-Type': 'application/json'
      },
    };

    return axios(config).then(function (response) {
      console.log('Res is : - ', response);
      return response.data;
    })
      .catch(function (error) {
        console.log(error);
      });
  } catch (err) {
    return false;
  }
}

export const adminSearchUser = (val) => {
  try {

    var config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://stacks-grant-backend.herokuapp.com/api/v1/admin/user/search?name=${val}`,
      headers: {
        'Content-Type': 'application/json'
      },
    };

    return axios(config).then(function (response) {
      return response.data;
    })
      .catch(function (error) {
        console.log(error);
      });
  } catch (err) {
    return false;
  }
}

export const findGrant = (val) => {
  try {
    var config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://stacks-grant-backend.herokuapp.com/api/v1/grant/findGrant?grantIssueNumber=${val}`,
      headers: {
        'Content-Type': 'application/json'
      },
    };

    return axios(config).then(function (response) {
      return response.data;
    })
      .catch(function (error) {
        console.log(error);
      });
  } catch (err) {
    return false;
  }
}

export const paymentUpdateUser = (params) => {
  try {
    var data = JSON.stringify(params);

    var config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: 'https://stacks-grant-backend.herokuapp.com/api/v1/grant/payment/update',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data

    };

    return axios(config).then(function (response) {
      return response.data;
    })
      .catch(function (error) {
        console.log(error);
        return false;
      });

  } catch (err) {
    return false;
  }
}