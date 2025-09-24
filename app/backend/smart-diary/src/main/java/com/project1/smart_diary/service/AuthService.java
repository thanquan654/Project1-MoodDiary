package com.project1.smart_diary.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.project1.smart_diary.converter.UserConverter;
import com.project1.smart_diary.dto.LoginGoogleDTO;
import com.project1.smart_diary.dto.request.LoginRequest;
import com.project1.smart_diary.dto.response.AuthenticationResponse;
import com.project1.smart_diary.entity.UserEntity;
import com.project1.smart_diary.exception.ApplicationException;
import com.project1.smart_diary.exception.ErrorCode;
import com.project1.smart_diary.repository.InvalidatedTokenRepository;
import com.project1.smart_diary.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserConverter  userConverter;
//    @Autowired
//    private InvalidatedTokenRepository invalidatedTokenRepository;
    @NonFinal
    @Value("${jwt.signerKey}")
    protected String Signer_Key;
    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long Valid_Duration;
//    @NonFinal
//    @Value("${jwt.refreshable-duration}")
//    protected long Refresh_Duration;

    public AuthenticationResponse authenticate(LoginRequest loginRequest) {
        UserEntity user = userRepository.findByEmail(loginRequest.getEmail());
        if (user == null) {
            throw new ApplicationException(ErrorCode.USER_NOT_EXISTED);
        }
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        boolean authenticated = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
        if (!authenticated) {
            throw new ApplicationException(ErrorCode.UNAUTHENTICATED);
        }
        String token = genToken(user);
        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .user(userConverter.convertToUserResponse(user))
                .build();
    }
    public AuthenticationResponse loginWithGoogle(LoginGoogleDTO loginGoogleDTO) {
        UserEntity user = userRepository.findByEmail(loginGoogleDTO.getEmail());
        if (user == null) {
            throw new ApplicationException(ErrorCode.USER_NOT_EXISTED);
        }
//        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
//        boolean authenticated = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
//        if (!authenticated) {
//            throw new ApplicationException(ErrorCode.UNAUTHENTICATED);
//        }
        String token = genToken(user);
        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .user(userConverter.convertToUserResponse(user))
                .build();
    }
    private String genToken(UserEntity user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issuer("Tienld.com")
                .issueTime(new Date())
                .expirationTime(new Date(System.currentTimeMillis() + Valid_Duration * 1000L)) // 1 ngày
                .jwtID(UUID.randomUUID().toString())
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(Signer_Key.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot sign JWS object", e);
            throw new RuntimeException(e);
        }
    }

}
