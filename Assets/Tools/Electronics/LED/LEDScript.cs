using UnityEngine;

public class LEDScript : MonoBehaviour
{
    public WireConnection wireConnection;  
    public Light pointLight;               

    void Start()
    {
     
        if (pointLight == null)
        {
            Debug.LogError("No Light component assigned. Please assign a Light component in the Inspector.");
            return;
        }

       
        pointLight.type = LightType.Point;
        pointLight.range = 1.0f;           
        pointLight.intensity = 0.0f;     
        pointLight.color = Color.yellow;    
    }

    void Update()
    {
      
        bool positiveConnected = IsCorrectlyConnected(wireConnection.positiveTerminal, wireConnection.ledPositivePin);
        bool negativeConnected = IsCorrectlyConnected(wireConnection.negativeTerminal, wireConnection.ledNegativePin);

        if (positiveConnected && negativeConnected)
        {
            pointLight.intensity = 1.0f;  
            // Debug.Log("LED is on.");
        }
        else
        {
            pointLight.intensity = 0.0f;  
            // Debug.Log("LED is off.");
        }
    }

    bool IsCorrectlyConnected(Transform batteryTerminal, Transform ledPin)
    {
        
        LineRenderer[] wires = FindObjectsOfType<LineRenderer>();
        foreach (LineRenderer wire in wires)
        {
            if ((wire.GetPosition(0) == batteryTerminal.position && wire.GetPosition(1) == ledPin.position) ||
                (wire.GetPosition(1) == batteryTerminal.position && wire.GetPosition(0) == ledPin.position))
            {
                return true;
            }
        }
        return false;
    }
}
