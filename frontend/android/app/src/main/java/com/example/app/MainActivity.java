package com.example.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {

        this.registerPlugin(GoogleAuth.class);

        super.onCreate(savedInstanceState);
    }
}


