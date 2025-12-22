-- REAL LOADER (HIDDEN FROM BROWSER)
print("^1[PROTECTED LOADER] ^2Loaded successfully!")
print("^3Join: discord.gg/yourserver")

-- Contoh fitur
game.Players.LocalPlayer.Character.Humanoid.WalkSpeed = 100
game.Players.LocalPlayer.Character.Humanoid.JumpPower = 150

-- Auto update checker
spawn(function()
    while wait(300) do -- tiap 5 menit
        pcall(function()
            loadstring(game:HttpGet("https://namaproject.vercel.app/api/loader.lua"))()
        end)
    end
end)

print("^5[LOADER] All features loaded!")
