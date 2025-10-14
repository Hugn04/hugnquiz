const routes = {
    home: '/',
    login: '/login',
    register: '/register',
    verifyEmail: '/verify-email',
    exam: '/example',
    editExample(params?: string) {
        return params ? `/myexam/${params}/edit` : '/myexam/:subject/edit';
    },
    test: '/test',
    abc: '/abc',
    conTest(params?: string) {
        return params ? `/exam/${params}` : '/exam/:subject';
    },
    myExam: '/myexam',
    createExample: '/myexam/create-example',
    profile(params?: string) {
        return params ? `/profile/@${params}` : '/profile/:email';
    },
    share: '/share/:id',
    favorite: '/my-favorite',
    changePassword: '/change-password',
    previewExample(params?: string) {
        return params ? `/preview/${params}` : '/preview/:subject';
    },
    admin: '/admin',
    message: '/message',
};
export default routes;
