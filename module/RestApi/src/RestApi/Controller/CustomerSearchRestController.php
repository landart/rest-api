<?php
namespace RestApi\Controller;

use RestApi\Controller\ParentController;
use RestApi\Form\SearchForm;
use RestApi\Model\Customer;
use Zend\View\Model\JsonModel;

/**
 * Manages the search action on the customer collection.
 */
class CustomerSearchRestController extends ParentController
{
  
    /**
     * @Override
     * Only allow the search itself: a GET action on the collection.
     */
    protected $allowedCollectionMethods = array(
        'GET'
    );
    
    /**
     * The default action when calling GET on this controller is the search itself
     * @return {Zend\View\Model\JsonModel}
     */
    public function getList($customerId = null, $lastName = null, $email = null)
    {
        $response = $this->getResponse();
        $headers = $response->getHeaders();
        $request = $this->getRequest();
        $customer = new Customer();
        $form = new SearchForm();
        
        // Using 'id' as a query parameter would result in a Zend error; 
        // I have mapped it to 'customerId' for simplicity.
        $inputData = array( 
            'id' => (int)$request->getQuery('customerId'),
            'lastName' => $request->getQuery('lastName'),
            'email' => $request->getQuery('email')
        );        
        
        // Validate input data
        $form->setInputFilter($customer->getSearchFilter());
        $form->setData($inputData);
        
        if (!$form->isValid()) {
            $response->setStatusCode(400); // Bad Request 
            return new JsonModel(array(
                'error' => 'input data is not valid'
            ));          
        }
             
        // Pass the ball on to the customer table to search        
        $results = $this->getCustomerTable()->search($form->getData());
        $data = array();
        foreach($results as $result) {
            $data[] = $result;
        }
        
        // Avoid cache 
        $headers->addHeaderLine('Cache-Control', 'max-age=0, no-cache, no-store');
        $headers->addHeaderLine('Pragma', 'no-cache');
        
        return new JsonModel(
            array('customers' => $data)
        );
    }
    
}