import dynamic from 'next/dynamic';

const App = dynamic(() => import('../components/AppShell'), {
  ssr: false,
});


 function Index() {
  return   <App />
 


}
export default Index