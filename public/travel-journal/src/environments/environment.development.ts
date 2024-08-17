export const environment = {

  projectDetails: {
    name: 'Travel Journal',
    description: 'The journey of a thousand miles begins with a single step.',
    developer: 'Bishnu Pokhrel',
    footerText:'Travel Journal, All rights reserved.',
    profileLink:'https://bishnupokhrel.netlify.app/'

  },
  params: {
    tripId: 'id',
    galleryId: 'galleryId',
  },
  urlShared: {
    login: '/login',
  },
  urlFrontend: {
    home: 'home',
    trips: 'trips',
    trip: 'trip',
    trip_id: 'trip/:id',
    createTrip: 'create-trip',
    editTrip: 'edit-trip',
    editTrip_id: 'edit-trip/:id',
    createGallery: 'trip/:id/add-gallery',
    editGallery: 'trip/:id/edit-gallery/:galleryId',
    signIn: 'sign-in',
    signUp: 'sign-up',
    error: '**',
  },
  urlApi: {
    baseUserUrl: 'http://localhost:3000/api/users',
    baseTripUrl: 'http://localhost:3000/api/trips',
    total: 'totals',
    galleries: 'galleries',
    query: {
      pageNumber: 'pageNumber',
      name: 'name'
    },
  },
  message: {
    updateFailMessage: 'Update unsuccessful!',
    createFailMessage: 'Create unsuccessful!',
    unauthorizedMessage: 'Unauthorized!',
    missingLoginDetails: 'Missing Username or Password!',
    passwordMissedMatch: 'Password missed match!',
    filledInTheBlank: 'Filled in the Blank!',
    tripsNotFound:'Currently no trips avaliable.'
  },
  numbers: {
    page: 1,
    limit: 4,
  },
  keys: {
    tokenKey: 'authToken',
    pageNumber: 'pageNumber',
  },
  forms: {

    galleryForm: 'galleryForm',
    tripForm: 'tripForm',
  }
};
