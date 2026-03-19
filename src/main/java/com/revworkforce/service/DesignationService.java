package com.revworkforce.service;

import com.revworkforce.entity.Designation;
import com.revworkforce.repository.DesignationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DesignationService {

    private final DesignationRepository designationRepository;

    public DesignationService(DesignationRepository designationRepository) {
        this.designationRepository = designationRepository;
    }

    public Designation save(Designation designation) {
        return designationRepository.save(designation);
    }

    public List<Designation> findAll() {
        return designationRepository.findAll();
    }
}