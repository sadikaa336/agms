package com.gasmeter.api.service;

import com.gasmeter.api.model.Customer;
import com.gasmeter.api.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    @Transactional
    public Customer createCustomer(Customer customer) {
        if (customerRepository.findByPhone(customer.getPhone()).isPresent()) {
            throw new IllegalArgumentException("Customer with this phone number already exists: " + customer.getPhone());
        }
        if (customer.getNationalId() != null && !customer.getNationalId().isBlank()) {
            if (customerRepository.findByNationalId(customer.getNationalId()).isPresent()) {
                throw new IllegalArgumentException("Customer with this National ID already exists: " + customer.getNationalId());
            }
        }
        customer.setCreatedAt(LocalDateTime.now());
        customer.setUpdatedAt(LocalDateTime.now());
        return customerRepository.save(customer);
    }

    @Transactional
    public Customer updateCustomer(Long id, Customer updated) {
        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with ID: " + id));

        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setNationalId(updated.getNationalId());
        existing.setAddress(updated.getAddress());
        existing.setUpdatedAt(LocalDateTime.now());

        return customerRepository.save(existing);
    }

    @Transactional
    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }
}
