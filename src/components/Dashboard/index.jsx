import { useState,useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import { Oval } from 'react-loader-spinner';
import * as yup from "yup";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useGetWeatherDataQuery, useGetWeatherDatafivedaysQuery } from '../../services/weatherApi';
import { setWeatherData,setFiveDaysData } from '../../slices/weatherSlice';
import moment from "moment"
import { useDispatch, useSelector } from 'react-redux';
const validationSchema = yup.object().shape({
  city: yup.string().required("City is required"),
});
const initialValues = {
  city: '',
};

const Dashboard = () => {
  const [input, setInput] = useState('');
  const dispatch = useDispatch()
  const api_key = 'f00c38e0279b7bc85480c3fe775d518c';
  const { data, isLoading, error, refetch } = useGetWeatherDataQuery(
    { q: input, api_key },
    { skip: !input } 
  );
  const { data: fivedaysData } = useGetWeatherDatafivedaysQuery({ lat: data?.coord?.lat, lon: data?.coord?.lon, api_key },{ skip: !data?.coord })
  const handleSubmit = async (data) => {
    setInput(data.city)
    refetch()
  }
  useEffect(() => {
    if (data) {
      dispatch(setWeatherData(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (fivedaysData) {
      dispatch(setFiveDaysData(fivedaysData));
    }
  }, [fivedaysData, dispatch]);
  const weatherData = useSelector((state)=>state.weather.weatherData)
  console.log("weatherdata",weatherData)
  const fivdaysweatherData = useSelector((state)=>state.weather.fiveDaysData)

  return (
    <div>
    <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={handleSubmit}
  >
    {({ errors, touched,values }) => (
      <Form>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">City</label>
            <Field
              name="city"
              type="text"
              value={values.city}
              className={
                'form-control block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6' +
                (errors.city && touched.city ? ' is-invalid' : '')
              }
            />
            <ErrorMessage
              name="city"
              component="div"
              className="invalid-feedback"
            />
          </div>
          <div>
            <button
              type="submit"
              loading={isLoading}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Search
            </button>
          </div>
        </div>
      </Form>
    )}
  </Formik>
      {isLoading && (
        <>
          <Oval type="Oval" color="black" height={100} width={100} />
        </>
      )}
      {error && (
        <>
          <br />
          <br />
          <span className="error-message">
            <FontAwesomeIcon icon={faFrown} />
            <span style={{ fontSize: '20px' }}>City not found</span>
          </span>
        </>
      )}
      {weatherData && (
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="mt-6 space-y-12 lg:grid lg:gap-x-6 lg:space-y-0">
            <div className="bg-gray-100">
              <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none">
                  <div className="group relative">
                    <div className="relative w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75">
                      <img
                        className="object-center"
                        src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                        alt={weatherData.weather[0].description}
                      />{Math.round(weatherData.main.temp)}
                      <sup className="deg">°C</sup>
                      <p>{moment().format('dddd DD MMMM')}</p>
                    </div>
                    <h3 className="mt-6 text-sm text-gray-500">
                      <a>
                        <span className="absolute inset-0" />
                        {weatherData.name}, <span>{weatherData.sys.country}</span>
                      </a>
                    </h3>
                    <p className="text-base font-semibold text-gray-900">{weatherData.weather[0].description.toUpperCase()}</p>
                    <p>Wind Speed: {weatherData.wind.speed}m/s</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
        &nbsp;
      {fivdaysweatherData && (
        <div className="bg-gray-100">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none">
              <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
                {fivdaysweatherData && fivdaysweatherData?.daily?.slice(0, 6).map((callout) => {
                  const dateString = moment.unix(callout.dt).format("DD/MM/YYYY");
                  return (
                    <div key={callout.name} className="group relative">
                      <div className="relative w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                        <img
                          src={`http://openweathermap.org/img/w/${callout.weather[0].icon}.png`}
                          alt={callout.imageAlt}
                          className=""
                        />
                        <h3 className="mt-6 text-sm text-gray-500">
                          <a href={callout.href}>
                            <span className="absolute inset-0" />
                            <div>{callout.temp.max} / {callout.temp.min}</div>
                            <div>{dateString}</div>
                          </a>
                        </h3>
                      </div>
                      <p className="text-base font-semibold text-gray-900">{""}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard