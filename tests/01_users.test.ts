import request from 'supertest';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { faker } from '@faker-js/faker';
import { infra } from './init';
import { getTestData, setTestData } from './test.utils';

///////////////////////////////////////////////////////////////////////////

describe('01 - User tests', function () {
    const agent = request.agent(infra.app);

    it('01:01 -> Create user', function (done) {
        loadUserCreateModel();
        const createModel = getTestData('userCreateModel');
        agent
            .post('/api/v1/users/')
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect((response) => {
                setUserId(response, 'userId_1');
                expectUserProperties(response);
                expectUserPropertyValues(response);
            })
            .expect(201, done);
    });

    it('01:02 -> Get user by id', function (done) {
        agent
            .get(`/api/v1/users/${getTestData('userId_1')}`)
            .expect((response) => {
                expectUserProperties(response);
                expectUserPropertyValues(response);
            })
            .expect(201, done);
    });

    it('01:03 -> Search users', function (done) {
        const firstName = getTestData('userCreateModel').FirstName;
        agent
            .get(`/api/v1/users/search?firstName=${firstName}`)
            .expect((response) => {
                expect(response.body.Data.Users).to.have.property('TotalCount');
                expect(response.body.Data.Users).to.have.property('RetrievedCount');
                expect(response.body.Data.Users).to.have.property('PageIndex');
                expect(response.body.Data.Users).to.have.property('ItemsPerPage');
                expect(response.body.Data.Users.TotalCount).to.greaterThan(0);
                expect(response.body.Data.Users.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.Users.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('01:04 -> Update user', function (done) {
        loadUserUpdateModel();
        const updateModel = getTestData('userUpdateModel');
        agent
            .put(`/api/v1/users/${getTestData('userId_1')}`)
            .send(updateModel)
            .expect((response) => {
                expectUserProperties(response);
                expect(response.body.Data.User.LastName).to.equal(updateModel.LastName);
                expect(response.body.Data.User.IsActive).to.equal(updateModel.IsActive);
            })
            .expect(200, done);
    });

    it('01:05 -> Negative - Create user with duplicate email', function (done) {
        const createModel = getTestData('userCreateModel');
        agent
            .post('/api/v1/users/')
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(409, done);
    });

    it('01:06 -> Negative - Create user without a password', function (done) {
        const invalidModel = {
            FirstName : faker.person.firstName(),
            Email     : faker.internet.email().toLowerCase(),
        };
        agent
            .post('/api/v1/users/')
            .send(invalidModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(422, done);
    });

    it('01:07 -> Negative - Get user by id - malformed id', function (done) {
        agent
            .get('/api/v1/users/not-a-uuid')
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(422, done);
    });

    it('01:08 -> Delete user', function (done) {
        agent
            .delete(`/api/v1/users/${getTestData('userId_1')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
                expect(response.body.Data.Deleted).to.equal(true);
            })
            .expect(200, done);
    });

    it('01:09 -> Negative - Get deleted user by id', function (done) {
        agent
            .get(`/api/v1/users/${getTestData('userId_1')}`)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });
});

///////////////////////////////////////////////////////////////////////////

function setUserId(response, key: string) {
    setTestData(response.body.Data.User.id, key);
}

function expectUserProperties(response) {
    const user = response.body.Data.User;
    expect(user).to.have.property('id');
    expect(user).to.have.property('FirstName');
    expect(user).to.have.property('LastName');
    expect(user).to.have.property('Email');
    expect(user).to.have.property('Phone');
    expect(user).to.have.property('UserName');
    expect(user).to.have.property('IsActive');
    expect(user).to.not.have.property('Password');
}

function expectUserPropertyValues(response) {
    const model = getTestData('userCreateModel');
    const user = response.body.Data.User;
    expect(user.FirstName).to.equal(model.FirstName);
    expect(user.LastName).to.equal(model.LastName);
    expect(user.Email).to.equal(model.Email);
    expect(user.UserName).to.equal(model.UserName);
}

function loadUserCreateModel() {
    const model = {
        FirstName : faker.person.firstName(),
        LastName  : faker.person.lastName(),
        Email     : faker.internet.email().toLowerCase(),
        Phone     : `+91-${faker.string.numeric(10)}`,
        UserName  : faker.internet.userName().toLowerCase().replace(/[^a-z0-9]/g, ''),
        Password  : 'Test@123',
    };
    setTestData(model, 'userCreateModel');
}

function loadUserUpdateModel() {
    const model = {
        LastName : faker.person.lastName(),
        IsActive : false,
    };
    setTestData(model, 'userUpdateModel');
}

///////////////////////////////////////////////////////////////////////////
