const env = require('./index')

describe('Environment', () => {
    test('Should return undefined if env function is not called', () => {
        expect(process.env.test).toBe(undefined)
    })

    test('Should return env variables if env function is loaded', () => {
        env()
        expect(process.env.my_app_env).toBe('{"nodeEnv":"development","api":{"prefix":"/api"},"database":{"username":"foo","password":"bar","name":"awesome_db_name","host":"my_db_host"}}')
    })
})