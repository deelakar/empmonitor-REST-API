package com.empmonitor.api.controllers;


import com.empmonitor.api.models.ERole;
import com.empmonitor.api.models.Role;
import com.empmonitor.api.models.User;
import com.empmonitor.api.payload.request.UpdateCitizen;
import com.empmonitor.api.payload.response.Citizen;
import com.empmonitor.api.payload.response.Contact;
import com.empmonitor.api.payload.response.File;
import com.empmonitor.api.payload.response.MessageResponse;
import com.empmonitor.api.repository.UserRepository;
import com.empmonitor.api.util.FileUploadUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class CitizenController {

    @Autowired
    UserRepository userRepository;

    // getCitizens get all by moderator and admin.
    @GetMapping("/citizens")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> getCitizens() {
        List<User> list = userRepository.findAll();
        List<Citizen> citizens = new ArrayList<>();
        for (User user : list) {
            citizens.add(getCitizenFromUser(user));
        }
        return  ResponseEntity.ok(citizens);
    }

    // getCitizenByNid get citizen by national identification.
    @GetMapping("/citizens/{nid}")
    public ResponseEntity<?> getCitizenByNid(@PathVariable String nid) {
        Optional<User> user = userRepository.findByUsername(nid);
        if (!user.isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Citizen not found for given nid."));
        }
        Citizen citizen = getCitizenFromUser(user.get());
        return  ResponseEntity.ok(citizen);
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile multipartFile) throws IOException {
        String fileName = multipartFile.getOriginalFilename();
        assert fileName != null;
        String fileNameCleaned = StringUtils.cleanPath(fileName);
        String uploadDir = "doc/";
        UUID uuid = UUID.randomUUID();
        fileName = uuid.toString()+".pdf";
        FileUploadUtil.saveFile(uploadDir, fileName, multipartFile);

        return ResponseEntity
                .ok()
                .body(new File(uploadDir + fileName));
    }

    @GetMapping("/doc/{fileName}")
    public ResponseEntity<?> downloadFile(@PathVariable String fileName) throws FileNotFoundException {
        MediaType mediaType = MediaType.parseMediaType("application/pdf");
        java.io.File file = new  java.io.File("doc" + "/" + fileName);
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + file.getName())
                .contentType(mediaType)
                .contentLength(file.length())
                .body(resource);
    }



    // updateCitizenByAdmin update the citizen by the admin and user
    @PutMapping("/citizens/{nid}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> updateCitizenByAdmin(@PathVariable String nid,@Valid @RequestBody UpdateCitizen citizen) {
        Optional<User> userOpt = userRepository.findByUsername(nid);
        if (!userOpt.isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Citizen not found for given nid."));
        }
        boolean isModerator = false;
        boolean isUser =false;
        boolean isAdmin = false;
        User user = userOpt.get();
        for (Role role : user.getRoles()) {
            if (role.getName() == ERole.ROLE_MODERATOR) {
                isModerator = true;
                break;
            }
            if (role.getName() == ERole.ROLE_USER) {
                isUser = true;
                break;
            }
            if (role.getName() == ERole.ROLE_ADMIN) {
                isAdmin = true;
                break;
            }
        }

        if (isModerator) {
            user.setApproved(citizen.isApproved());
            userRepository.save(user);
        }
        if (isUser || isModerator || isAdmin ) {
            user.setDocs(citizen.getDocs());
            user.setQualifications(citizen.getQualifications());
            userRepository.save(user);
        }
        return ResponseEntity
                .ok()
                .body(new MessageResponse("Successfully update the citizens.."));
    }


    // findCitizens Company officers should be able to find candidates based on qualifications
    @GetMapping("/citizens/find")
    // @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> findCitizens(@RequestParam String term) {
        List<User> list = userRepository.findByQualificationsLike(term);
        List<Citizen> citizens = new ArrayList<>();
        for (User user : list) {
            citizens.add(getCitizenFromUser(user));
        }
        return  ResponseEntity.ok(citizens);
    }

    // deleteCitizens The SLBFE staff can deactivate an individual’s account if the citizen is deceased.
    @DeleteMapping("/citizens/{nid}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCitizens(@PathVariable String nid) {
        Optional<User> user = userRepository.findByUsername(nid);
        if (!user.isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Citizen not found for given nid."));
        }
        userRepository.delete(user.get());
        return ResponseEntity
                .ok()
                .body(new MessageResponse("Successfully deleted the user. nid: " + nid));
    }

    // getContacts The SLBFE staff should be able to collect information about contacts of any citizen
    @GetMapping("/citizens/{nid}/contacts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getContacts(@PathVariable String nid) {
        Optional<User> user = userRepository.findByUsername(nid);
        if (!user.isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Citizen not found for given nid."));
        }
        return  ResponseEntity.ok(new Contact(user.get().getEmail()));
    }

    // getCitizenFromUser convert User to the Citizen.
    private Citizen getCitizenFromUser(User user) {
        Citizen citizen = new Citizen();
        citizen.setId(user.getId());
        citizen.setNid(user.getUsername());
        citizen.setName(user.getName());
        citizen.setAge(user.getAge());
        citizen.setLatitude(user.getLatitude());
        citizen.setLongitude(user.getLongitude());
        citizen.setProfession(user.getProfession());
        citizen.setAffiliation(user.getAffiliation());
        citizen.setQualification(user.getQualifications());
        citizen.setFile(user.getDocs());
        return citizen;
    }
}
